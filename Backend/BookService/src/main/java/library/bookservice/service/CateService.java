package library.bookservice.service;

import library.bookservice.exception.CustomException;
import library.bookservice.model.Category;
import library.bookservice.repository.CateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CateService {
    @Autowired
    private CateRepo cateRepo;

    public List<Category> getAllCates() {
        return cateRepo.findAll();
    }

    public Category getCateById(int id) {
        if(cateRepo.existsById(id)) {
            return cateRepo.findById(id).get();
        }
        else{
            throw new CustomException("Category does not exist !!", HttpStatus.NOT_FOUND);
        }
    }

    public Category saveCate(Category cate) {
        return cateRepo.save(cate);
    }

    public Category updateCate(Category cate) {
        if(cateRepo.existsById(cate.getCategoryId())){
            return cateRepo.save(cate);
        }
        else{
            throw new CustomException("Category does not exist !!", HttpStatus.NOT_FOUND);
        }
    }

    public void deleteCate(int id) {
        if(cateRepo.existsById(id)){
            cateRepo.deleteById(id);
        }
        else{
            throw new CustomException("Category does not exist !!", HttpStatus.NOT_FOUND);
        }
    }
}
