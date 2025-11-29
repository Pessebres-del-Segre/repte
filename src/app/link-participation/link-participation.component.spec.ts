import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LinkParticipationComponent } from './link-participation.component';
import { ChallengeService } from '../services/challenge.service';

describe('LinkParticipationComponent', () => {
  let component: LinkParticipationComponent;
  let fixture: ComponentFixture<LinkParticipationComponent>;
  let mockChallengeService: jasmine.SpyObj<ChallengeService>;

  beforeEach(async () => {
    const challengeServiceSpy = jasmine.createSpyObj('ChallengeService', ['getStores', 'unlockStore']);
    challengeServiceSpy.getStores.and.returnValue(of([
      { id: 1, name: 'Test Store', description: 'Test Description', isUnlocked: false, location: 'Test Location' }
    ]));

    await TestBed.configureTestingModule({
      imports: [LinkParticipationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (param: string) => param === 'book_id' ? '1' : param === 'empresa_id' ? '1' : null
              }
            }
          }
        },
        { provide: ChallengeService, useValue: challengeServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkParticipationComponent);
    component = fixture.componentInstance;
    mockChallengeService = TestBed.inject(ChallengeService) as jasmine.SpyObj<ChallengeService>;
    fixture.detectChanges();
  });

});
