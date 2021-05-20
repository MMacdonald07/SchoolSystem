package com.mmacd.school.payload.response;

import java.util.List;

public class JwtResponse {

    private String accessToken;

    private final String type = "Bearer";

    private Long id;

    private String username;

    private String email;

    private String subject;

    private Integer grade;

    private final List<String> roles;

    public JwtResponse(String accessToken, Long id, String username, String email,
                       String subject, Integer grade, List<String> roles) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.subject = subject;
        this.grade = grade;
        this.roles = roles;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    public String getType() {
        return type;
    }

    public List<String> getRoles() {
        return roles;
    }
}
