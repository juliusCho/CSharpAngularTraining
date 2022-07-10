import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination?: Pagination;
  userParams: UserParams = new UserParams({
    userName: '',
    token: '',
    knownAs: '',
    gender: '',
    orderBy: 'lastActive',
  });
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    const userParams = this.memberService.getUserParams();
    if (userParams) {
      this.userParams = userParams;
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);

    this.memberService.getMembers(this.userParams).subscribe({
      next: (response) => {
        this.members = response.result ?? [];
        this.pagination = response.pagination;
      },
    });
  }

  resetFilters() {
    const userParams = this.memberService.resetUserParams();
    if (!userParams) return;

    this.userParams = userParams;

    this.loadMembers();
  }

  pageChanged(event: { page: number }) {
    if (!this.userParams) return;

    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
}
