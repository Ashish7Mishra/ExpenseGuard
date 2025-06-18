package com.track.service;

import com.track.dto.ExpenseDto;
import com.track.entities.ETUser;
import com.track.entities.Expense;
import com.track.Repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional // Good practice for service layers that modify data
public class ExpenseService {

	private final ExpenseRepository expenseRepository;

	private ETUser getCurrentUser() {
		// This is the magic line that retrieves the user details we set in the
		// JwtAuthenticationFilter
		return (ETUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}

	private ExpenseDto mapToDto(Expense expense) {
		return ExpenseDto.builder().id(expense.getId()).description(expense.getDescription())
				.amount(expense.getAmount()).expenseDate(expense.getExpenseDate()).build();
	}

	private Expense mapToEntity(ExpenseDto expenseDto) {
		return Expense.builder().description(expenseDto.getDescription()).amount(expenseDto.getAmount())
				.expenseDate(expenseDto.getExpenseDate()).build();
	}

	public ExpenseDto createExpense(ExpenseDto expenseDto) {
		// 1. Get the currently authenticated user
		ETUser currentUser = getCurrentUser();

		// 2. Map the DTO to an Expense entity
		Expense expense = mapToEntity(expenseDto);

		// 3. Set the user association
		expense.setUser(currentUser);

		// 4. Save the new expense to the database
		Expense savedExpense = expenseRepository.save(expense);

		// 5. Map the saved entity back to a DTO and return it
		return mapToDto(savedExpense);
	}

	public List<ExpenseDto> findAllByCurrentUser() {
		// 1. Get the currently authenticated user
		ETUser currentUser = getCurrentUser();

		// 2. Use the repository to find all expenses for that user's ID
		return expenseRepository.findByUserId(currentUser.getId()).stream()
				// 3. Map each found Expense entity to an ExpenseDto
				.map(this::mapToDto)
				// 4. Collect the results into a List
				.collect(Collectors.toList());
	}

	public void deleteExpense(Long expenseId) {
		// 1. Get the currently authenticated user
		ETUser currentUser = getCurrentUser();

		// 2. Find the expense by its ID or throw an exception if not found
		Expense expense = expenseRepository.findById(expenseId)
				.orElseThrow(() -> new IllegalStateException("Expense not found with id: " + expenseId));

		// 3. THE CRITICAL SECURITY CHECK: Verify that the user owns this expense
		if (!expense.getUser().getId().equals(currentUser.getId())) {
			// If the IDs do not match, throw an exception. This prevents a user from
			// deleting someone else's expense.
			throw new SecurityException("User does not have permission to delete this expense");
		}

		// 4. If the check passes, delete the expense
		expenseRepository.delete(expense);
	}

}