package com.mmacd.school.controllers;

import com.mmacd.school.models.User;
import com.mmacd.school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

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
}
