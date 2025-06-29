package com.water.customer.Controller;

import com.water.customer.DTO.TariffRequestDTO;
import com.water.customer.DTO.TariffResponseDTO;
import com.water.customer.Entity.customer;
import com.water.customer.Service.TariffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tariff")
public class TariffController {

    @Autowired
    private TariffService tariffService;

    @PostMapping("/create")
    public TariffResponseDTO createTariff(@RequestBody TariffRequestDTO requestDTO){
        return tariffService.createTariff(requestDTO);
    }

    @GetMapping("/current")
    public TariffResponseDTO getCurrentTariff(@RequestParam("usertype") customer.Usertype usertype,  @RequestParam(required=false) LocalDate asOfDate){
        if (asOfDate==null) asOfDate=LocalDate.now();
        return tariffService.getCurrentTariff(usertype, asOfDate);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TariffResponseDTO>> getAllTariffs() {
        List<TariffResponseDTO> tariffs = tariffService.listAllTariffs();
        return ResponseEntity.ok(tariffs);
    }
}
