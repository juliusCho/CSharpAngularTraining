import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]> = of([]);

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
  }
}
