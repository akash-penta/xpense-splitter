import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class ServerService {
    constructor(private http: Http) {}
    getReport(data) {
        return this.http.post('https://money-split.herokuapp.com/getReport',data);
    }
}