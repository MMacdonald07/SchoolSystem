package com.mmacd.school.controllers;

import com.mmacd.school.models.ERole;
import com.mmacd.school.models.Role;
import com.mmacd.school.models.User;
import com.mmacd.school.payload.request.AddUserRequest;
import com.mmacd.school.payload.response.MessageResponse;
import com.mmacd.school.repository.RoleRepository;
import com.mmacd.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/all")
    public String allAccess() {
        return "School Server";
    }

    @GetMapping("/teacher/{subject}")
    @PreAuthorize("hasRole('TEACHER')")
    public List<User> teacherAccess(@PathVariable("subject") String subject) {
        return userRepository.getAllBySubjectAndGradeNotNull(subject);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> adminAccess() {
        return userRepository.findAll();
    }

    @PostMapping("/admin/adduser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest addUserRequest) {
        if (userRepository.existsByUsername(addUserRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username already in use"));
        }

        if (userRepository.existsByEmail(addUserRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email already in use"));
        }

        User user = new User(
                addUserRequest.getUsername(),
                addUserRequest.getEmail(),
                passwordEncoder.encode(addUserRequest.getPassword()),
                addUserRequest.getSubject().equals("") ? null : addUserRequest.getSubject(),
                addUserRequest.getGrade());

        Set<String> strRoles = addUserRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found"));
            roles.add(studentRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "teacher":
                        Role teacherRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
                        roles.add(teacherRole);
                        break;
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
                        roles.add(adminRole);
                        break;
                    default:
                        Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
                        roles.add(studentRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("New user successfully added")
        );
    }

    @DeleteMapping(path = "/admin/deleteuser/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable("userId") Long userId) {
        boolean exists = userRepository.existsById(userId);

        if (!exists) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User does not exist"));
        }

        userRepository.deleteById(userId);

        return ResponseEntity.ok(
                new MessageResponse("User with id " + userId + " successfully deleted")
        );
    }
}
