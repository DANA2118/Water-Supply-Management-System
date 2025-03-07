package com.water.customer.Service.impl;

import com.water.customer.DTO.ResponseDTO;
import com.water.customer.DTO.customerDTO;
import com.water.customer.Entity.customer;
import com.water.customer.Repository.customerRepository;
import com.water.customer.Service.customerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class customerServiceimpl implements customerService {

    @Autowired
    private customerRepository cRepo;

    @Override
    public ResponseEntity<ResponseDTO>savecustomer(customerDTO cDTO) {
        customer C = new customer();
        C.setAccountNo(cDTO.getAccountNo());
        C.setName(cDTO.getName());
        C.setTelephoneNo(cDTO.getTelephoneNo());
        C.setEmail(cDTO.getEmail());
        C.setAddress(cDTO.getAddress());
        C.setMeterNo(cDTO.getMeterNo());
        C.setStatus(customer.Status.valueOf(cDTO.getStatus()));
        C.setUsertype(customer.Usertype.valueOf(cDTO.getUsertype()));

        customer savedCustomer = cRepo.save(C);
        return new ResponseEntity<>(ResponseDTO.builder()
                .data(savedCustomer)
                .message("Saved Customer Successfully")
                .responseCode(HttpStatus.CREATED)
                .build(), HttpStatus.CREATED);
    }

    @Override
    public List<customerDTO> getAllCustomers() {
        return cRepo.findAll().stream().map(data -> new customerDTO(
                data.getAccountNo(),
                data.getName(),
                data.getTelephoneNo(),
                data.getEmail(),
                data.getAddress(),
                data.getMeterNo(),
                data.getCreated_at(),
                data.getUpdated_at(),
                data.getStatus().name(), // Convert Enum to String
                data.getUsertype().name() // Convert Enum to String
        )).collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<ResponseDTO> findCustomer(int AccountNo) {
        Optional<customer> c = cRepo.findById(AccountNo);

        if (c.isPresent()) {
            customer data = c.get();
            customerDTO cDTO = new customerDTO(
                    data.getAccountNo(),
                    data.getName(),
                    data.getTelephoneNo(),
                    data.getEmail(),
                    data.getAddress(),
                    data.getMeterNo(),
                    data.getCreated_at(),
                    data.getUpdated_at(),
                    data.getStatus().name(),
                    data.getUsertype().name()
            );

            return ResponseEntity.ok(ResponseDTO.builder()
                    .data(cDTO)
                    .message("Customer Found")
                    .responseCode(HttpStatus.OK)
                    .build());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseDTO.builder()
                .message("Customer Not Found")
                .responseCode(HttpStatus.NOT_FOUND)
                .build());
    }

    @Override
    public ResponseEntity<ResponseDTO> deleteCustomer(int AccountNo) {
        if (cRepo.existsById(AccountNo)) {
            cRepo.deleteById(AccountNo);
            return ResponseEntity.ok(ResponseDTO.builder()
                    .message("Customer Deleted Successfully")
                    .responseCode(HttpStatus.OK)
                    .build());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseDTO.builder()
                .message("Customer Not Found")
                .responseCode(HttpStatus.NOT_FOUND)
                .build());
    }

    @Override
    public ResponseEntity<ResponseDTO> updateCustomer(int accountNo, customerDTO cDTO) {
        Optional<customer> existingCustomer = cRepo.findById(accountNo);

        if (existingCustomer.isPresent()) {
            customer C = existingCustomer.get();
            C.setName(cDTO.getName());
            C.setTelephoneNo(cDTO.getTelephoneNo());
            C.setEmail(cDTO.getEmail());
            C.setAddress(cDTO.getAddress());
            C.setMeterNo(cDTO.getMeterNo());

            if (cDTO.getStatus() != null) {
                C.setStatus(customer.Status.valueOf(cDTO.getStatus()));
            }
            if (cDTO.getUsertype() != null) {
                C.setUsertype(customer.Usertype.valueOf(cDTO.getUsertype()));
            }

            customer updatedCustomer = cRepo.save(C);

            return ResponseEntity.ok(ResponseDTO.builder()
                    .data(updatedCustomer)
                    .message("Customer Updated Successfully")
                    .responseCode(HttpStatus.OK)
                    .build());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseDTO.builder()
                .message("Customer Not Found")
                .responseCode(HttpStatus.NOT_FOUND)
                .build());
    }

}
