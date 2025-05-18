package com.water.customer.Service;

import com.water.customer.DTO.ComplaintDTO;
import com.water.customer.Entity.complaints;
import com.water.customer.Entity.customer;
import com.water.customer.Repository.complaintRepository;
import com.water.customer.Repository.customerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class complaintService {

    @Autowired
    private complaintRepository complaintRepo;

    @Autowired
    private customerRepository customerRepo;

    public complaints saveComplaint(ComplaintDTO complaintDTO) {
        complaints complaint = new complaints();

        Integer accountNo = AuthUtil.getCurrentAccountNo();
        customer c = customerRepo.findByAccountNo(accountNo);

        complaint.setSubject(complaintDTO.getSubject());
        complaint.setTelephoneNo(complaintDTO.getTelephoneNo());
        complaint.setDescription(complaintDTO.getDescription());
        complaint.setDate(LocalDate.now());
        complaint.setCustomer(c);

        return complaintRepo.save(complaint);

    }

    public List<ComplaintDTO> listAllComplaints() {
        return complaintRepo.findAllByOrderByDateDesc()
                .stream()
                .map(complaint -> new ComplaintDTO(
                        complaint.getComplaintId(),
                        complaint.getSubject(),
                        complaint.getTelephoneNo(),
                        complaint.getDescription(),
                        complaint.getDate(),
                        complaint.getCustomer().getAccountNo()))
                .collect(Collectors.toList());
    }
}
