angular.module('Solicitude.Create', ['SATCI.Shared', 'Solicitude.resources'])
.controller('CreateSolicitudeCtrl', (
  $scope, 
  $filter, 
  $controller, 
  Citizens, 
  Institutions, 
  Parishes, 
  Solicitudes, 
  paginateService, 
  PathTemplates)  => {

  $controller('CreateCitizenCtrl', {$scope : $scope});
  $controller('CreateInstitutionCtrl', {$scope : $scope});
  $controller('DatepickerCtrl', {$scope : $scope});

  let add = null;
  let search = null;
  let applicant_type = '';

  $scope.full_name = null;
  $scope.applicant_id = null;
  $scope.identification = null;
  $scope.solicitude = {
    alerts: [],
  }

  $scope.addApplicant = () =>{
    add = true;
    search = false;

    $scope.full_name = null;
    $scope.applicant_id = null;
    $scope.identification = null;

    $scope.applicantTemplate = `${PathTemplates.partials}${applicant_type}/create.html`;
  };

  $scope.clear = () =>{
    $scope.identification = null;
    $scope.full_name = null;
    $scope.applicant_id = null;
    $scope.template = null;
    $scope.applicant_type = null;
    $scope.applicantTemplate = null;
  }

  $scope.close = () => {
    add = null;
    search = null
    $scope.template = '';
    $scope.applicant = false;
    $scope.applicantTemplate = '';
  };

  $scope.closeAlertSolicitude = (index) => {
    $scope.solicitude.alerts.splice(index, 1);
  };

  $scope.getApplicant = (type) => {
    $scope.applicant_type = applicant_type = type;
    $scope.template = `${PathTemplates.partials}solicitude/applicant.html`;
  };

  $scope.parishes = Parishes.get((data) => {
    return $scope.parishes = data.parishes;
  })

  $scope.searchApplicant = () => {
    search = true;
    add = false;

    if (applicant_type === 'citizen') {
      Citizens.get((data) => {
        $scope.applicants = data.citizens;
      });
    }
    if (applicant_type === 'institution') {
      Institutions.get((data) => {
        $scope.applicants = data.institutions;
      });
    }

    $scope.applicantTemplate = `${PathTemplates.partials}solicitude/search-applicant.html`;
  };

  $scope.saveSolicitude = () => {
    let solicitude = {
      reception_date: $filter('date')($scope.reception_date, 'yyyy-MM-dd'), 
      applicant_type: $scope.applicant_type, 
      applicant_id: $scope.applicant_id, 
      document_date: $filter('date')($scope.document_date, 'yyyy-MM-dd'), 
      topic: $scope.topic, 
    }
    // debugger;
    Solicitudes.save(solicitude).$promise.then(
      (data) => {
        if (data.success) {
          $scope.solicitude.alerts = [{
            type: 'success',
            message: 'Solicitud registrada exitosamente',
          }];
        }
      }, 
      (fails) => {
        angular.forEach(fails.data, (values, key) => {
          angular.forEach(values, (value) => {
            $scope.applicant.alerts.push({type: 'danger', message: value})
          })
        })
      })
  }

  $scope.selectApplicant = (id, identification, full_name) => {
    $scope.full_name = full_name;
    $scope.applicant_id = id;
    $scope.identification = identification;
  };

  $scope.$watch('applicant_type', () => {
    if (add) {
      $scope.addApplicant();
    }
    if (search) {
      $scope.applicantTemplate = '';
        // $scope.searchApplicant();
      }
    });

  $scope.displayed = [];

  $scope.callServer = function callServer (tableState) {

    $scope.isLoading = true;
    let pagination = tableState.pagination;
      // $scope.DisplayedPages = 1;

      let start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      let number = pagination.number || 10;  // Number of entries showed per page.

      paginateService.getPage($scope.applicants, start, number, tableState).then(function (result) {

        $scope.displayed = result.data;
        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        $scope.isLoading = false;

      });
    };

    /******************************************************Datepicker******************************************************/
    $scope.datepicker = {
      reception_date: null,
      document_date: null,
    };

    $scope.clear = () => {
      $scope.datepicker = {
        reception_date: null,
        document_date: null,
      }
    };

    $scope.today = () => {
      $scope.datepicker.reception_date = new Date();
      $scope.datepicker.document_date = new Date();
    };
    // $scope.today();

    // Disable weekend selection
    $scope.disabled = (date, mode) => {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = () => {
      // $scope.minDate = $scope.minDate ? null : new Date();
      var date = new Date();
      $scope.minDate = date.getFullYear() + '-01-02'
    };
    $scope.toggleMin();

    $scope.toggleMax = () => {
      $scope.maxDate = $scope.maxDate ? null : new Date();
    };
    $scope.toggleMax();

    $scope.open = ($event, value) => {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datepicker[value] = !$scope.datepicker[value];
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
    [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
    ];

    $scope.getDayClass = (date, mode) => {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i=0;i<$scope.events.length;i++){
          var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    };
  })