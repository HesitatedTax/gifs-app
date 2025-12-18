import { AfterViewInit, Component, computed, ElementRef, inject, Input, input, output, signal, viewChild } from '@angular/core';
  import { GifList } from "../../components/gif-list/gif-list";
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/service/scroll-state.service';

// const imageUrls: string[] = [
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg",
//     "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg"
// ];

@Component({
  selector: 'app-trending-page',
  // imports: [GifList],
  templateUrl: './trending-page.html',
 

})
export default class TrendingPage implements AfterViewInit{ 
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);
  
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }
  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;
    const scrollTop = scrollDiv.scrollTop; 
    const clienHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    // console.log({scrollTop, clienHeight, scrollHeight});
    const isAtBottom = scrollTop + clienHeight + 300 >= scrollHeight;
    // console.log({isAtBottom});
    this.scrollStateService.trendingScrollState.set(scrollTop);



    if (isAtBottom){
      this.gifService.loadTrendingGifs();
   }
  }
}
  // gifs = signal (imageUrls);
  // gifSignal = input<string>('');
  // gifSignal1 = output<string>();

  // gifs2!: string ; 
  // @Input() gifnosignal!: string ;