package com.track.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * This controller is responsible for serving the HTML pages of the user interface.
 * It uses @Controller, so Spring MVC will resolve the returned strings as view names.
 */
@Controller
@RequestMapping("/") // Maps this controller to handle requests starting from the root path
public class UiController {

    /**
     * Handles requests for the login page.
     * @return the name of the "login" template for Thymeleaf to render.
     */
    @GetMapping("login")
    public String showLoginPage() {
        return "login"; // Resolves to: src/main/resources/templates/login.html
    }

    /**
     * Handles requests for the registration page.
     * @return the name of the "register" template.
     */
    @GetMapping("register")
    public String showRegisterPage() {
        return "register"; // Resolves to: src/main/resources/templates/register.html
    }

    /**
     * Handles requests for the root URL ("/"). This will be our main dashboard.
     * @return the name of the "dashboard" template.
     */
    @GetMapping
    public String showDashboardPage() {
        return "dashboard"; // Resolves to: src/main/resources/templates/dashboard.html
    }
}