# Standards

## Approach

The aim is to follow standards wherever possible, in order to create a codebase that is consistent and familiar to contributors. The overall approach is to favour clarity over conciseness, but especially to favour efficiency and elegance.

When standards get in the way of good code they shouldn't be followed slavishly, but it's important that the spirit and consistent look and feel of the codebase is preserved.

All code is commonly owned; when encounering code that could be improved in any way, please go ahead.

## Code Standards

For Python code, follow [PEP 8](https://www.python.org/dev/peps/pep-0008/). For JavaScript, follow PEP 8 except where [JSLint](http://www.jslint.com/lint.html) defines something else; give priority to JSLint.

## Documentation

All code that isn't directly part of a library, framework or external module should ideally be lightly documented.

[Pydoc](https://docs.python.org/2/library/pydoc.html) will be used to auto-generate documentation from Python code, while the JS side will use [ng-doc](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation), a fork of JSDoc.

As well as module, class anf method-level docstrings, it's worth putting a comment string into the code wherever there is an algorithm or design pattern implementation, or when a solution favours efficiency over clarity.

## Testing

All code should have unit tests in place and passing before being merged into the project's main git branches, and code coverage tools should be used to verify a reasonable level of coverage.

For Django, [nose](https://github.com/django-nose/django-nose), [coverage](http://nedbatchelder.com/code/coverage/) and [tox](http://codespeak.net/tox/) are used.

For Angular, we use [Jasmine](http://jasmine.github.io/1.3/introduction.html), [Protractor](http://angular.github.io/protractor/#/) and coverage.

## File Layout

For Django, small differences to the standard app-based layout are implemented; primarily the use of a main settings module that makes per-environment settings easier to manage, and the fact that all Django apps are in an `apps` subfolder, for easier navigation.

For Angular, the Yeoman generator `cg-angular` provides the [structure recommended by Google](https://docs.google.com/a/ostmodern.co.uk/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub) and should be adhered to, although it's worth noting that some template differences have been put in place.

## Version control

The main project repository uses [Git](http://git-scm.com/) version control, and is hosted by [GitHub](https://github.com).

Development against the code base follows the standard [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow.

## Version numbering

Version numbers are created at release time, and follow [SemVer](http://semver.org/), with an additional portion. The result is the format `major.minor.revision.build`, the first three each being a non-negative integer that increments by one, and with the following definitions:

- `major`: A major upgrade. API consistency and backward compatibility cannot be guaranteed. Major new features are included.
- `minor`: Additional functionality or new features are introduced, backwards compatibility is assured.
- `revision`: Bug fixes, ad-hoc patches, any minor change. This is incremented with each release unless there's a major or minor increment.
- `build`: A non-sequential SHA sum that is the commit hash of the deployed build. This is autogenerated and simplifies locating specific code in the repository.