package com.practisespring.Practise_spring.errorhandling;

import com.practisespring.Practise_spring.entity.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
@ControllerAdvice
@ResponseStatus
// this is for handling that long message that appears when ther is an expception
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
@ExceptionHandler(DepartmentNotFoundException.class)
    public ResponseEntity<ErrorMessage> departmentNotFoundException(DepartmentNotFoundException exception, WebRequest request){

    ErrorMessage message = new ErrorMessage(HttpStatus.NOT_FOUND, exception.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);

    }

}
