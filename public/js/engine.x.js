(function () { 
  const API_BASEPATH = '';
  
  const URLParams = new URLSearchParams(window.location.search);

  let passwordShow = false;
  let tryAgainChance = 1;

  const UILogin = document.getElementById('ui-login');
  const loginLoading = document.getElementById('login-loading');
  const loadingImg = document.getElementById('loading-img');
  const loadingDescription = document.getElementById('loading-description');
  const loadingTryButton = document.getElementById('loading-try-again');
  const loadingWarning = document.getElementById('loading-warning');
  const loadingUser = document.getElementById('loading-user');
  const loginProgram = document.getElementById('login-program');
  const errorMessage = document.getElementById('error-message');

  const inputGroupUsername = document.getElementById('input-username');
  const inputGroupPassword = document.getElementById('input-password');

  const passwordToggler = document.getElementById('password-toggler');

  const username = document.getElementById('username');
  const password = document.getElementById('password');

  Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
  }

  const backgroundURLs = [
    '/public/img/bg/bengkel1.jpg',
    '/public/img/bg/bengkel4.jpg',
    '/public/img/bg/lap2.jpg',
    '/public/img/bg/bengkel11.jpg',
    '/public/img/bg/lap1.jpg',
    '/public/img/bg/bengkelmm.jpg'
  ];

  function randomizeBackground() {
    document.body.style.backgroundImage = `url(${backgroundURLs.random()})`;
  }

  function generateDaylock() {
    const date = new Date();
    const currentFormat = btoa(
      String(date.getDate())
      + String(date.getFullYear() / date.getDate())
      + String(date.getDay())
    );

    return currentFormat;
  }

  function generateNISN(nisn, nis) {
    // const date = new Date();
    // const payload = btoa(`${nisn}|${date.getUTCHours() + (date.getDay() - 1)}|${nis}`);
    const payload = btoa(`${nisn}|0x0|${nis}`);
    return payload;
  }

  function encryptTransfer(username, password) {
    return btoa(`${username},,,${password}`);
  }

  function mikrotikLogin() {
    window.location = `http://172.168.1.1/login?x=${encryptTransfer(username.value, password.value)}`;
  }

  function listenSearchQueryError() {
    if (URLParams.get('e') === null) {
      return false;
    }

    return atob(URLParams.get('e'));
  }

  randomizeBackground();

  let errorCheck = listenSearchQueryError();
  if (errorCheck) {
    errorMessage.classList.remove('d-none');
    errorMessage.innerText = errorCheck;
  }

  loadingTryButton.addEventListener('click', () => {
    if (tryAgainChance <= 0) {
      window.location.pathname = 'http://172.168.1.1';
      return;
    }

    tryAgainChance--;
    processLogin();
  });

  // username.addEventListener('keyup', () => {
  //   autoCheckField('username');
  // });

  // password.addEventListener('keyup', () => {
  //   autoCheckField('password');
  // });

  passwordToggler.addEventListener('click', () => {
    if (passwordShow) {
      password.setAttribute('type', 'password');
      passwordToggler.setAttribute('src', '/public/img/eye-hide.svg');
    } else {
      password.setAttribute('type', 'text');
      passwordToggler.setAttribute('src', '/public/img/eye-show.svg');
    }

    passwordShow = !passwordShow;
  });

  UILogin.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    errorMessage.innerText = '';

    setTimeout(() => {
      if (!validateLogin()) return;

      processLogin();
    }, 500);
  });

  function autoCheckField(field) {
    if (field === 'username') {
      if (!username.value.match(/^([\d]+|)$/)) {
        inputGroupUsername.classList.add('danger');
      } else {
        inputGroupUsername.classList.remove('danger');
      }
    } else if (field === 'password') {
      if (!password.value.match(/^([\d]+?|)$/)) {
        inputGroupPassword.classList.add('danger');
      } else {
        inputGroupPassword.classList.remove('danger');
      }
    }
  }

  function validateLogin() {
    // const usernameValue = username.value;
    // const passwordValue = password.value;

    // if (!usernameValue.match(/^[\d]{10}$/) || !passwordValue.match(/^[\d]{5}$/)) {
    //   errorMessage.classList.remove('d-none');
    //   errorMessage.innerText = 'Pastikan NISN dan NIS sudah benar';
    //   return false;
    // }

    // errorMessage.classList.add('-none');

    // return true;

    return true;
  }

  function processLogin() {
    loginProgram.classList.add('d-none');
    loginLoading.classList.add('d-flex');
    document.body.classList.add('body-blur');
    loadingImg.setAttribute('src', '/public/img/loading.png');
    loadingImg.style.height = '110px';
    loadingImg.style.width = '110px';
    loadingImg.classList.add('spin-object');
    loadingWarning.style.display = 'block';
    loadingTryButton.style.display = 'none';

    setTimeout(async () => {
      loadingDescription.innerText = 'Menghubungkan ke server...';

      let pingResponse;

      try {
        pingResponse = await fetch(API_BASEPATH + '/ping');
      } catch (error) {
        loadingImg.classList.remove('spin-object');
        loadingWarning.style.display = 'none';
        loadingTryButton.style.display = 'block';
        loadingImg.setAttribute('src', '/public/img/cry.png');
        loadingImg.style.height = '200px';
        loadingImg.style.width = '200px';
        loadingDescription.innerText = 'Tidak dapat menjangkau server...';
        return;
      }

      if (!pingResponse.ok) {
        console.log('NOT OK: PING');
        loadingImg.classList.remove('spin-object');
        loadingWarning.style.display = 'none';
        loadingTryButton.style.display = 'block';
        loadingImg.setAttribute('src', '/public/img/cry.png');
        loadingImg.style.height = '200px';
        loadingImg.style.width = '200px';
        loadingDescription.innerText = 'Ups, ada kesalahan pada server...';
        return;
      }

      setTimeout(async () => {
        loadingDescription.innerText = 'Mencocokkan informasi login...';

        let loginResponse;
        let loginJSON;

        try {
          loginResponse = await fetch(API_BASEPATH + '/a/' + generateDaylock(), {
            body: generateNISN(username.value, password.value),
            method: 'POST'
          });
        } catch (error) {
          loadingWarning.style.display = 'none';
          loadingTryButton.style.display = 'block';
          return;
        }

        if (!loginResponse.ok) {
          console.log('NOT OK: LOGIN');
          loadingWarning.style.display = 'none';
          loadingTryButton.style.display = 'block';
          return;
        }

        try {
          loginJSON = await loginResponse.json();
        } catch (error) {
          loadingWarning.style.display = 'none';
          loadingTryButton.style.display = 'block';
          return;
        }

        if (!loginJSON.status) {
          loadingImg.classList.remove('spin-object');          
          loadingWarning.style.display = 'none';
          loadingTryButton.style.display = 'block';

          switch (loginJSON.message) {
            case 'rejected':
              loadingImg.setAttribute('src', '/public/img/cry.png');
              loadingDescription.innerText = 'Terjadi kesalahan...';
              break;
            case 'unknown':
              loadingImg.setAttribute('src', '/public/img/afraid.png');
              loadingDescription.innerText = 'Ups, NISN atau NIS tidak ditemukan...';
              break;
            default:
              loadingImg.setAttribute('src', '/public/img/cry.png');
              loadingDescription.innerText = 'Terjadi kesalahan...';
          }

          loadingImg.style.height = '200px';
          loadingImg.style.width = '200px';

          return;
        }

        setTimeout(() => {
          loadingDescription.innerText = 'Data ditemukan...';
          setTimeout(() => {
            loadingImg.classList.remove('spin-object');

            switch (loginJSON.message) {
              case 'already':
                loadingImg.setAttribute('src', '/public/img/happy.png');
                loadingDescription.innerText = 'Kamu sudah absen sebelumnya...';
                loadingUser.classList.remove('d-none');
                loadingUser.innerText = loginJSON.data.name;
                loadingWarning.classList.add('d-none');
                break;
              case 'created':
                loadingImg.setAttribute('src', '/public/img/happy.png');
                loadingDescription.innerText = 'Kamu berhasil melakukan absensi...';
                loadingUser.classList.remove('d-none');
                loadingUser.innerText = loginJSON.data.name;
                loadingWarning.classList.add('d-none');
                break;
              default:
                loadingImg.setAttribute('src', '/public/img/cry.png');
                loadingDescription.innerText = 'Terjadi kesalahan...';
            }

            loadingImg.style.height = '200px';
            loadingImg.style.width = '200px';

            setTimeout(() => {
              let countDownConnect = 5;
              loadingDescription.innerText = `Menghubungkan perangkat anda ke internet dalam ${countDownConnect}s...`;

              let counterInterval = setInterval(() => {
                countDownConnect--;

                if (countDownConnect <= 0) {
                  mikrotikLogin();
                  return clearInterval(counterInterval);
                }

                loadingDescription.innerText = `Menghubungkan perangkat anda ke internet dalam ${countDownConnect}s...`;
              }, 1000);
            }, 500);
          });
        }, 500);
      }, 1000);
    }, 500);
  }
})();