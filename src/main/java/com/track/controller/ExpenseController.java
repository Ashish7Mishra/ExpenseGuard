package com.track.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.track.dto.ExpenseDto;
import com.track.service.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
// This annotation applies the security rule to all methods in this class
@PreAuthorize("hasRole('USER')") 
public class ExpenseController {

	 private final ExpenseService expenseService;

	    @PostMapping
	    public ResponseEntity<ExpenseDto> createExpense(@RequestBody ExpenseDto expenseDto) {
	        return ResponseEntity.ok(expenseService.createExpense(expenseDto));
	    }

	    @GetMapping
	    public ResponseEntity<List<ExpenseDto>> getAllExpenses() {
	        return ResponseEntity.ok(expenseService.findAllByCurrentUser());
	    }

	    @DeleteMapping("/{expenseId}")
	    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId) {
	        expenseService.deleteExpense(expenseId);
	        // .build() creates an empty response body, which is standard for a successful DELETE.
	        return ResponseEntity.ok().build();
	    }
}
