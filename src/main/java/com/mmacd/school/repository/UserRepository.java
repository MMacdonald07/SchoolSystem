package com.mmacd.school.repository;

import com.mmacd.school.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> getAllBySubjectAndGradeNotNull(String subject);

    List<User> findAll();

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
