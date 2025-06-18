package com.track.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.track.entities.ETUser;

public interface UserRepository extends JpaRepository<ETUser, Long> {

	Optional<ETUser> findByEmail(String email);
	
}
