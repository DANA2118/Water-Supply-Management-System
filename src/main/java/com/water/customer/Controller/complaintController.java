package com.water.customer.Controller;


import com.water.customer.DTO.ComplaintDTO;
import com.water.customer.Entity.complaints;
import com.water.customer.Service.complaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaint")
public class complaintController {

    @Autowired
    private complaintService service;

    @PostMapping("/save")
    public ResponseEntity<complaints> saveComplaint(@RequestBody ComplaintDTO complaintDTO) {
        complaints save = service.saveComplaint(complaintDTO);
        return ResponseEntity.ok(save);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllComplaints() {
        List<ComplaintDTO> complaints = service.listAllComplaints();
        return ResponseEntity.ok(complaints);
    }
}
