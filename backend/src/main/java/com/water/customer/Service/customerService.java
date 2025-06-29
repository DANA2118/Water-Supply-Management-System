package com.water.customer.Service;

import com.water.customer.DTO.ResponseDTO;
import com.water.customer.DTO.customerDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface customerService {
    ResponseEntity<ResponseDTO>savecustomer(customerDTO cDTO);
    List<customerDTO> getAllCustomers();
    ResponseEntity<ResponseDTO> findCustomer(int AccountNo);
    ResponseEntity<ResponseDTO> deleteCustomer(int AccountNo);
    ResponseEntity<ResponseDTO> updateCustomer(int accountNo, customerDTO cDTO);
    int getTotalCustomers();
    int countActiveCustomers();
}
