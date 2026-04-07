package com.practisespring.Practise_spring.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    //@RequestMapping(value="/",method= RequestMethod.GET)

    @Value("${welcome.message:StudyMate AI is running}")
    private String welcomeMessage;
    @GetMapping("/")
    public String helloWorld(){
        return welcomeMessage;
    }
}
