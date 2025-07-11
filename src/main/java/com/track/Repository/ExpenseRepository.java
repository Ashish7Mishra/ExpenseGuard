package com.track.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.track.entities.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> findByUserId(Long userId);
}
