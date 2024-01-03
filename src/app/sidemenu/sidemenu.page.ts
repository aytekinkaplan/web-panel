import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { signOut } from '../auth.actions';
import { loadProjects, switchProject } from '../project.actions';
import { activeProject, projects } from '../project.selectors';
import { Subject } from 'rxjs';
import { isLoggedIn } from '../auth.selectors';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit, OnDestroy {
  activeProject$ = this.store.pipe(
    select(activeProject),
    shareReplay(1),
  );

  projects$ = this.store.pipe(
    select(projects),
    shareReplay(1),
  );

  unsubscribe: Subject<void> = new Subject();

  isLoggedIn$ = this.store.pipe(
    select(isLoggedIn),
    takeUntil(this.unsubscribe)
  );

  constructor(
    private router: Router,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe(() => {
      this.store.dispatch(loadProjects());
    });

    // this.isLoggedIn$.subscribe((loggedIn) => {
    //   if (!loggedIn) {
    //     this.router.navigate(['/login'], {
    //       replaceUrl: true
    //     });
    //   }
    // });

    let activeProjectSelected = false;

    this.activeProject$.subscribe((currentProject) => {
      if (currentProject) {
        activeProjectSelected = true;
      }
    });

    // if(this.route.firstChild) {
    //   this.route.firstChild.params.subscribe((params) => {
    //     console.log(params);
    //   });
    // }

    this.projects$.subscribe((projectList) => {
      if (projectList.length === 0) {
        return;
      }

      if (!activeProjectSelected) {
        this.store.dispatch(switchProject({activeProject: projectList[0].id}));
        this.router.navigate([`/projects/${projectList[0].id}`]);
      }
    });

    this.activeProject$.subscribe((p) => {
      if (p) {
        this.router.navigate([`/projects/${p.id}`]);
      }
    });
  }

  signOut() {
    this.store.dispatch(signOut());
  }

  compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  switchProject(event) {
    this.router.navigate([`/projects/${event.target.value.id}`]);
    // this.store.dispatch(switchProject({activeProject: event.target.value}));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
   }
}
