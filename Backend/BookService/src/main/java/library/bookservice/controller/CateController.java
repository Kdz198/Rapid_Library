package library.bookservice.controller;

import jakarta.ws.rs.POST;
import library.bookservice.model.Category;
import library.bookservice.service.CateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/categories")
public class CateController {
    @Autowired
    private CateService cateService;

    @GetMapping
    public List<Category> getCategories() {
        return cateService.getAllCates();
    }

    @GetMapping("/{id}")
    public Category getCategory(@PathVariable int id) {
        return cateService.getCateById(id);
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return cateService.saveCate(category);
    }

    @PutMapping
    public Category updateCategory(@RequestBody Category category) {
        return cateService.updateCate(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable int id) {
        cateService.deleteCate(id);
    }
}
