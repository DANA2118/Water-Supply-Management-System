package com.water.customer.Controller;

import com.water.customer.DTO.ResponseDTO;
import com.water.customer.DTO.customerDTO;
import com.water.customer.Service.customerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/customer")
@CrossOrigin
@RestController
public class customerController {

    @Autowired
    private customerService cService;

    @PostMapping("/save")
    public ResponseEntity<ResponseDTO> saveCustomer(@RequestBody customerDTO cDTO) {
        return cService.savecustomer(cDTO);
    }

    @PutMapping("/update/{accountNo}")
    public ResponseEntity<ResponseDTO> updateCustomer(@PathVariable int accountNo, @RequestBody customerDTO cDTO) {
        return cService.updateCustomer(accountNo, cDTO);
    }


    @GetMapping("/get")
    public List<customerDTO> getAllCustomers() {
        return cService.getAllCustomers();
    }

    @GetMapping("/get/{AccountNo}")
    public ResponseEntity<ResponseDTO> findCustomer(@PathVariable int AccountNo) {
        return cService.findCustomer(AccountNo);
    }

    @DeleteMapping("/delete/{AccountNo}")
    public ResponseEntity<ResponseDTO> deleteCustomer(@PathVariable int AccountNo) {
        return cService.deleteCustomer(AccountNo);
    }
}
