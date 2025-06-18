package com.track.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.track.Repository.UserRepository;
import com.track.config.JwtService;
import com.track.dto.AuthenticationRequest;
import com.track.dto.AuthenticationResponse;
import com.track.dto.RegisterRequest;
import com.track.entities.ETUser;
import com.track.entities.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	
	
	public AuthenticationResponse register(RegisterRequest request) {
		
			var user=ETUser.builder()
					.firstName(request.getFirstname())
					.lastName(request.getLastname())
					.email(request.getEmail())
					.password(passwordEncoder.encode(request.getPassword()))
					.role(Role.USER)
					.build();
			
			repository.save(user);
			
			var jwtToken=jwtService.generateToken(user);
			
			return AuthenticationResponse.builder()
					.token(jwtToken)
					.build();
		
	}
	
	
	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(), 
						request.getPassword()
						)
				);
		
		var user=repository.findByEmail(request.getEmail())
				.orElseThrow();
		
		var jwtToken=jwtService.generateToken(user);
		
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.build();
		
	}

}
