import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://lapshop-backend.onrender.com/api';
    // private apiUrl = 'http://localhost:4000/api';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/users`);
    }

    getProducts(): Observable<any> {
        return this.http.get(`${this.apiUrl}/products`);
    }

    //Add product
    addProduct(product: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/products`, product);
    }
    //Update product
    updateProduct(product_id:any ,product: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/products/${product_id}`, product);
    }
    //Delete product
    deleteProduct(productId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/products/${productId}`);
    }
    //Get product by id
    getProductById(productId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/products/${productId}`);
    }
    uploadImage(formData: FormData) {
        return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData);
    }

    // Create user api
     //Add product
     addUser(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, user);
    }
    // login user   
    loginUser(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, user);
    }



    // add to cart
    addToCart(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/cart`, data);
    }

    // place order api  
    placeOrder(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders`, data);
    }
    
    //Get product which are ordered
    getOrderedProduct(): Observable<any> {
        return this.http.get(`${this.apiUrl}/orderedProducts`);
    }

    // api to get latest orders to admin
    getLatestOrders(): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-orders`);
    } 

    // api to update order status
    updateOrderStatus(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/update-order-status`, data);
    }

    // api to get dashboard data
    getDashboardData(): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard`);
    }

    // api to remove product
    removeProduct(productId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/products/${productId}`);
    }

    // api to remove cart item
    removeCartItem(payload: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}/cart/${payload.user_id}/${payload.product_id}`);
    }

    // api to get cart items
    getCartItems(payload: any): Observable<any> {
        return this.http.get(`${this.apiUrl}/cart/${payload.user_id}`);
    }

}
