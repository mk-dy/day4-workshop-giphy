import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SearchCriteria } from '../models';
import { GiphyService } from '../services/giphy.services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  searchForm!: FormGroup

  constructor(private fb:FormBuilder, private giphySvc: GiphyService) { }

  ngOnInit(): void {
    this.searchForm = this.createForm()
  }

  private createForm(): FormGroup {
    return this.fb.group({
      api: this.fb.control<string>(this.getAPIKey(), [ Validators.required]), // we put our apikey in input placeholder
      search: this.fb.control<string>('', [ Validators.required ]),
      results: this.fb.control<number>(5),
      rating: this.fb.control<string>('g')
    })
  }

  hasError(ctrlName: string) {
    return this.searchForm.get(ctrlName)?.hasError('required')
  }

  performSearch() {
    const criteria: SearchCriteria = this.searchForm.value as SearchCriteria
    this.searchForm = this.createForm()
    console.info('search criteria: ', criteria)
    this.giphySvc.search(criteria)
      .then(result => {
        console.info('>>>>> result: ', result)
        this.giphySvc.onNewResult.next(result)
        this.saveAPIKey(criteria.api)
        this.createForm()
      })
      .catch(error => {
        console.error('>>>> error: ',error)
        alert(`>>>> error ${JSON.stringify(error)}`)
      })
  }

  private getAPIKey(): string {
    let key = localStorage.getItem('api')
    if (!key)
      return ''    
    return key
  }

  private saveAPIKey(key: string) {
    localStorage.setItem('api', key)
  }

}
