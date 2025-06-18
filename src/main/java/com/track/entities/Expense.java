package com.track.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "ET_USER_EXPENSES")
public class Expense {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "expense_seq_generator")
	@SequenceGenerator(name = "expense_seq_generator", sequenceName = "expense_seq", allocationSize = 1)
	private Long id;
	private String description;
	private BigDecimal amount;
	private LocalDate expenseDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private ETUser user;
}
