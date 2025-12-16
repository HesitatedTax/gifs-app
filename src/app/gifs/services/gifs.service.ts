import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';



const loadFromLocalStorage = () => {
    const history = localStorage.getItem('searchHistory') ?? '{}';
    const gifs = JSON.parse(history);
    return gifs;
}



@Injectable({providedIn: 'root'})
export class GifService {

    private http = inject(HttpClient);

    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(true);

    searchHistory= signal<Record<string, Gif[]>>(loadFromLocalStorage());
    searchHistorykeys= computed(() => Object.keys(this.searchHistory()));

    constructor(){
        this.loadTrendingGifs();
    }

    safeGifsToLocalStorage= effect (()=>{
        const history= JSON.stringify(this.searchHistory());
        localStorage.setItem('searchHistory', history);
    });


    loadTrendingGifs(){
        this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
            params:{
                api_key: environment.giphyApiKey,
                limit: 20,

            },
        }).subscribe( (resp) =>{
          const gifs=GifMapper.mapGiphyItemsToGifArray(resp.data);
          this.trendingGifs.set(gifs);
          this.trendingGifsLoading.set(false);
          console.log(gifs);
        });
    }
    searchGifs(query: string): Observable<Gif[]> {
        return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
            params:{
                api_key: environment.giphyApiKey,
                q: query,
                limit: 20,
            },
        })
        .pipe(
            map(({ data }) => data),
            map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
            tap(items => {
                this.searchHistory.update(history => ({
                    ...history,
                    [query.toLowerCase()]: items,
                }));
            })
        );
    //     .subscribe( (resp) =>{
    //       const gifs=GifMapper.mapGiphyItemsToGifArray(resp.data);
    //      console.log({search: gifs});
    //      return gifs;
    //     });
    }
    getHistoryGifs(query: string): Gif[] {
        return this.searchHistory()[query]?? [];
    }

    // saveGifsToLocalStorage  = effect(() =>{
    //     localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory())) 
    // });
    
   
}
// const loadFromLocalStorage = (): Record<string, Gif[]> => {
//     const history = localStorage.getItem('searchHistory')?? '';
//     return history ? JSON.parse(history) : {};
// };