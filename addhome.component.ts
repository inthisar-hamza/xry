import { GetService } from './../services/get.service';
import { MediaService } from './../services/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateService } from './../services/update.service';
import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../common-service.service';

import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';

import * as _ from 'lodash';



@Component({
  selector: 'app-services',
  templateUrl: './addhome.component.html',
  styleUrls: ['./addhome.component.css'],
})
export class AddHomeComponent implements OnInit {
  services: any = [];
  errorMessage;

  detailsform: FormGroup;

  location: FormGroup;
  nearest: FormGroup;
  contact: FormGroup;
  property: FormGroup;
  rent: FormGroup;

  adsID;
  adsData: any;

  constructor(
    public commonService: CommonServiceService,
    private fb: FormBuilder,
    private uService: UpdateService,
    private route: ActivatedRoute,
    private router: Router,
    private mediaService: MediaService,
    private getService: GetService
  ) {
    this.route.params.subscribe((params) => {
      this.adsID = params.id;
      console.log(this.adsID);

      const pack = {
        adsid: this.adsID
      }
      this.getService.getHomeAds(pack).subscribe((results) => {
        this.adsData = results[0];
        console.log(this.adsData.negotiation);


        this.detailsform.get('contact').patchValue({
          contactname: this.adsData.contactname,
          email: this.adsData.email,
          contactnumber1: this.adsData.number1,
          contactnumber2: this.adsData.number2,
          socialMedia: this.adsData.social,
          facebook: this.adsData.facebook,
        });

        this.detailsform.get('property').patchValue({
          roomscount: this.adsData.roomscount,
          bathroomscount: this.adsData.bathroomscount,
          floorscount: this.adsData.floorscount,
          floorarea: this.adsData.totalsquarefeet,
          parkingspace: this.adsData.parkingspace,
          propertyage: this.adsData.propertyage,
        });

        this.detailsform.get('location').patchValue({
          city: this.adsData.city,
          street: this.adsData.street,
          province: this.adsData.province,
          latitude: this.adsData.latitude,
          longitude: this.adsData.longitude,
          nearesttrain: this.adsData.nearesttrain,
          nearestbus: this.adsData.nearestbus,
          country: ['SL'],
        });



      });
    });

    

    // forms initiating
    this.detailsform = this.fb.group({
      post: this.fb.group({
        title: [''],
        housetype: [''],
        areasize: [''],
        areatype: [''],
        price: [''],
        pricetype: [''],
        pricefor: [''],
        negotiation: [''],
        description: [''],
        availability: [''],
        youtube: [''],
        publisher: [''],
        agentid: [''],
      }),

      contact: this.fb.group({
        contactname: [''],
        email: [''],
        contactnumber1: [],
        contactnumber2: [],
        socialMedia: [],
        facebook: [],
      }),
      property: this.fb.group({
        roomscount: [],
        bathroomscount: [],
        floorscount: [],
        floorarea: [],
        parkingspace: [],
        propertyage: [],
      }),

      location: this.fb.group({
        city: [],
        street: [],
        province: [],
        latitude: [],
        longitude: [],
        nearesttrain: [],
        nearestbus: [],
        country: ['SL'],
      }),
    });
  }

  ngOnInit(): void {
    this.createFormInputs();
    this.getImages();
    console.log(this.personForm);
    this.getHomeproperty();
  }

  availability: any[] = [
    'Available',
    'Urgent Sale',
    'Under Offer',
    'Reduced Price',
    'Available soon',
    'Sold',
  ];

  landsFor: any[] = ['Sale', 'Lease', 'Either'];

  priceFor: any[] = ['Per Perch', 'Per Acre', 'Total'];

  publisher: any[] = ['Owner', 'Agent', 'Assistant'];

  province: any[] = [
    'Central Province',
    'Eastern Province',
    'Northern Province',
    'Southern Province',
    'Western Province',
    'Uva Province',
    'Sabaragamuwa Province',
    'North Western Province',
    'North Central Province',
  ];

 
  // rental

  HouseType: any[] = [
    'House',
    'Apartment',
    'Annexe',
    'Bungalow',
    'Villa',
    'Studio',
    'Commercial',
    'Other',
  ];

  priceType: any[] = ['Per Day', 'Per Week', 'Per Month', 'Per Year'];


  onSub(any) {
    console.log(any.value);
  }


  submit() {}

  onSubmit() {
    console.log(this.personForm.value);
  }

  ////

  onSubmit2() {
    console.log(this.detailsform.value);
  }

 

  // delete nearest
  customTB(index, item) {
    return `${index}-${item.id}`;
  }

  hosturl = 'http://localhost:3000/uploads/homeads/';
  imageArray = [];
  image;
  files: File[] = [];

  getImages() {
    const pack = {
      adsID: this.adsID,
    };
    console.log(pack);
    this.mediaService.getHomeImages(pack).subscribe((data) => {
      this.imageArray = data;
      console.log(this.imageArray);
    });
  }

  deleteImage(data) {
    const pack = {
      id: data.id,
      adsID: this.adsID,
    };
     this.mediaService.deleteHomeImages(pack).subscribe((data) => {
        console.log(data);
    });

  }

  onSelect(event) {
    console.log(event);

    this.files.push(...event.addedFiles);
    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
      formData.append('file', this.files[i]);
    }
    console.log(formData);
    this.mediaService.uploadHMedia(formData, this.adsID).subscribe((results) => {
      console.log(results);
      alert('upload succesfull');
    });
  }


  onRemove(event) {
    console.log(event);

    this.files.splice(this.files.indexOf(event), 1);
  }

  /////////////////////////////////////
  // single image/ logo upload
  fileToUpload: File = null;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  onLogoSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    /* this.uploadService.uploadLogo(formData, this.adsID).subscribe((res) => {
      console.log(formData);
      alert('Uploaded Successfully.');
    }); */
  }

  /////

  personForm: FormGroup;
  selectedHobbiesNames: [string];
  propertyFeatures: Array<String> = [
    'Fully furnished',
    'Swimming Pool',
    'AC Rooms',
    'Wifi',
    'TV/Dish',
    'Hot Water',
    'Garden',
    'Telephone',
    'Luxury',
    'CCTV',
    'Beach Front',
    'River Front',
    'Garage',
    'Phase 3 Electrycity',
    'Roof Top',
    'Gym',
    'Big Hall',
    'Theatre',
    'Servant Room',
  ];

  createFormInputs() {
    this.personForm = new FormGroup({
      propertFeature: this.createHobbies(this.propertyFeatures),
    });
    this.getSelectedHobbies('one', 'two');
  }

  createHobbies(hobbiesInputs) {
    const arr = hobbiesInputs.map((hobby) => {
      return new FormControl(hobby.selected || false);
    });
    
    return new FormArray(arr);
  }

  getSelectedHobbies(one, two) {
    this.selectedHobbiesNames = _.map(
      this.personForm.controls.propertFeature['controls'],
      (hobby, i) => {
        return hobby.value && this.propertyFeatures[i];
      }
    );
    this.getSelectedHobbiesName();
  }

  getSelectedHobbiesName() {
    this.selectedHobbiesNames = _.filter(this.selectedHobbiesNames, function (
      hobby
    ) {
      if (hobby !== false) {
        return hobby;
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////

  SubmitHome() {
    const pack = {
      homeid: this.adsID,
      data: this.detailsform.value,
    };
    console.log(this.detailsform.value);
    this.uService.updateHome(pack).subscribe((results) => {
      console.log(results);
    });
    this.updateFeatures();
    this.router.navigate(['admin/dashboard']);
  }

  updateFeatures() {
    const pack = {
      homeID: this.adsID,
      data: this.personForm.value,
    };
    this.uService.updateHProperty(pack).subscribe((results) => {
      console.log(results);
    });
  }

  propertyData;
  getHomeproperty(){
    const pack = {
      homeID: this.adsID
    };
    this.getService.getHomeProperty(pack).subscribe((results) => {
      console.log(results);
    });
  }
}
