import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map, Subject } from "rxjs";
import { SearchCriteria } from "../models";

@Injectable()
export class GiphyService {

    onNewResult = new Subject<string[]>() 
    // to send out the event


    constructor(private http: HttpClient) { }

    search(criteria: SearchCriteria): Promise<string[]> { 
        // getSearch(): Promise<string[]> is basically telling us that the function is returning a Promise<string[]> type
        
        const params = new HttpParams()
            .set('api_key', criteria.api)
            .set('q', criteria.search)
            .set('limit', criteria.results)
            .set('rating', criteria.rating)

        return firstValueFrom(
            this.http.get<any>('https://api.giphy.com/v1/gifs/search' , { params }) // this is when get all the data
                .pipe( // pipe is used so you can perform more functions on it
                    map(result => {
                        const data = result.data // from giphy, you receive an array
                        return data.map((v: any) => v.images.fixed_height.url as string)
                    })
                )
        )
           
        
            
        

    }
}