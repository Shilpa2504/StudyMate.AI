package com.practisespring.Practise_spring.errorhandling;

public class DepartmentNotFoundException extends Exception{
    public DepartmentNotFoundException() {
        super();
    }

    public DepartmentNotFoundException(String message){
        super(messagge);
    }


    public DepartmentNotFoundException(String message,Throwable cause){
        super(message,cause);
    }

    public DepartmentNotFoundException(Throwable cause){
        super(cause);
    }
    protected DepartmentNotFoundException(String message,Throwable cause,boolean enableSuppress,boolean writableStackTrace ){
        super(message,cause,enableSuppress,writableStackTrace);
    }

}
// after adding all this go and add optional which we are getting in return and thrwo exception in service layer







