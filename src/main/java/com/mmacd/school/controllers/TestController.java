package com.mmacd.school.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public String allAccess() {
        return "School Server";
    }

    @GetMapping("/teacher/{subject}")
    @PreAuthorize("hasRole('TEACHER')")
    public String teacherAccess(@PathVariable("subject") String subject) {
        return "Teacher Board for " + subject;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin";
    }
}
