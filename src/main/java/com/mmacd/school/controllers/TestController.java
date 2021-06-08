package com.mmacd.school.controllers;

import com.mmacd.school.models.ERole;
import com.mmacd.school.models.Role;
import com.mmacd.school.models.User;
import com.mmacd.school.payload.request.AddUserRequest;
import com.mmacd.school.payload.request.UpdateUserRequest;
import com.mmacd.school.payload.response.MessageResponse;
import com.mmacd.school.repository.RoleRepository;
import com.mmacd.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
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

    @GetMapping("/admin/getuser/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public User getUser(@PathVariable("userId") Long userId) {
        return userRepository.getById(userId);
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

    @PutMapping("/admin/updateuser/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateUser(@PathVariable("userId") Long userId,
                                        @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User does not exist"));
        }

        String newUsername = updateUserRequest.getUsername();
        String newEmail = updateUserRequest.getEmail();
        String newPassword = updateUserRequest.getPassword();
        String newSubject = updateUserRequest.getSubject();
        Integer newGrade = updateUserRequest.getGrade();

        if (userRepository.existsByUsername(newUsername)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username already in use"));
        }

        if (userRepository.existsByEmail(newEmail)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email already in use"));
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException(
                "Student with id " + userId + " does not exist"
        ));

        if (newUsername != null && newUsername.length() > 0 && !Objects.equals(user.getUsername(), newUsername)) {
            user.setUsername(newUsername);
        }

        if (newEmail != null && newEmail.length() > 0 && !Objects.equals(user.getEmail(), newEmail)) {
            user.setEmail(newEmail);
        }

        if (newPassword != null && newPassword.length() > 0 && !passwordEncoder.matches(newPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        if (newSubject != null && newSubject.length() > 0 && !Objects.equals(user.getSubject(), newSubject)) {
            user.setSubject(newSubject);
        }

        if (newGrade != null && newGrade >= 0 && newGrade <= 100 && !Objects.equals(user.getPassword(), newPassword)) {
            user.setGrade(newGrade);
        }

        return ResponseEntity.ok(
                new MessageResponse("User successfully updated")
        );
    }
}
