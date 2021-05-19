package com.mmacd.school.controllers;

import com.mmacd.school.models.ERole;
import com.mmacd.school.models.Role;
import com.mmacd.school.models.User;
import com.mmacd.school.payload.request.LoginRequest;
import com.mmacd.school.payload.request.SignUpRequest;
import com.mmacd.school.payload.response.JwtResponse;
import com.mmacd.school.payload.response.MessageResponse;
import com.mmacd.school.repository.RoleRepository;
import com.mmacd.school.repository.UserRepository;
import com.mmacd.school.security.jwt.JwtUtils;
import com.mmacd.school.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(), loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwt(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(),
                userDetails.getSubject(), userDetails.getGrade(), roles
        ));
    }

//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
//        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Username already in use"));
//        }
//
//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Email already in use"));
//        }
//
//        User user = new User(
//                signUpRequest.getUsername(),
//                signUpRequest.getEmail(),
//                passwordEncoder.encode(signUpRequest.getPassword()));
//
//        Set<String> strRoles = signUpRequest.getRole();
//        Set<Role> roles = new HashSet<>();
//
//        if (strRoles == null) {
//            Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
//                    .orElseThrow(() -> new RuntimeException("Error: Role not found"));
//            roles.add(studentRole);
//        } else {
//            strRoles.forEach(role -> {
//                switch (role) {
//                    case "teacher":
//                        Role teacherRole = roleRepository.findByName(ERole.ROLE_TEACHER)
//                                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
//                        roles.add(teacherRole);
//                        break;
//                    case "admin":
//                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
//                                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
//                        roles.add(adminRole);
//                        break;
//                    default:
//                        Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
//                                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
//                        roles.add(studentRole);
//                }
//            });
//        }
//
//        user.setRoles(roles);
//        userRepository.save(user);
//
//        return ResponseEntity.ok(
//                new MessageResponse("New user successfully added")
//        );
//    }
}
