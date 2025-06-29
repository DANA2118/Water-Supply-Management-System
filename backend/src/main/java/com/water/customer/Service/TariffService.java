package com.water.customer.Service;

import com.water.customer.DTO.TariffRequestDTO;
import com.water.customer.DTO.TariffResponseDTO;
import com.water.customer.Entity.Tariff;
import com.water.customer.Entity.customer;
import com.water.customer.Repository.tariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TariffService {
    @Autowired
    private tariffRepository tariffRepo;

    @Transactional
    public TariffResponseDTO createTariff(TariffRequestDTO requestDTO) {
        Tariff tariff = Tariff.builder()
                .effectiveDate(requestDTO.getEffectiveDate())
                .fixedCharge(requestDTO.getFixedCharge())
                .ratePerUnit(requestDTO.getRatePerUnit())
                .usertype(requestDTO.getUsertype())
                .build();
        Tariff savedTariff = tariffRepo.save(tariff);

        return toDTO(savedTariff);
    }

    public TariffResponseDTO getCurrentTariff(customer.Usertype usertype, LocalDate asOfDate){
        Tariff currentTariff = tariffRepo.findCurrentByType(usertype, LocalDate.now())
                .orElseThrow(() -> new IllegalStateException("Tariff not found"));
        return toDTO(currentTariff);
    }

    @Transactional(readOnly = true)
    public List<TariffResponseDTO> listAllTariffs() {
        return tariffRepo.findAll().stream()
                .sorted(Comparator.comparing(Tariff::getEffectiveDate).reversed())
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TariffResponseDTO toDTO(Tariff tariff){
        return TariffResponseDTO.builder()
                .id(tariff.getId())
                .fixedCharge(tariff.getFixedCharge())
                .ratePerUnit(tariff.getRatePerUnit())
                .effectiveDate(tariff.getEffectiveDate().toString())
                .usertype(tariff.getUsertype())
                .build();
    }
}
