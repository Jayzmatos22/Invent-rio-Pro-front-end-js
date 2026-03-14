// Teste js.
console.log("O Javascript está conectado e rodando!");

// ==========================================
// 1. SELEÇÃO DE ELEMENTOS GLOBAIS
// ==========================================
const inputEmail = document.getElementById('emailUser');
const inputPassword = document.getElementById('passwordUser');
const inputName = document.getElementById('inputName'); // Só existe no Registro
const formRegister = document.getElementById('formRegister'); // Só existe no Registro
const formLogin = document.getElementById('formLogin'); // Só existe no Login



// ==========================================
// 2. REGRAS DE VALIDAÇÃO (Critérios)
// ==========================================
const isNameValid = (name) => {
    const criteriaName = {
        hasLetters: /[a-zA-Z]/.test(name),
        noNumbers: !/\d/.test(name),
        noSpecialChars: /^[a-zA-Z\s]+$/.test(name),
        minSize: name.length >= 6
    };
    return Object.values(criteriaName).every(Boolean);
};


const isEmailValid = (email) => {
    const emailLower = email.toLowerCase();
    return emailLower.length >= 10 && 
           emailLower.includes('@') && 
           emailLower.endsWith('.com');
};


const isPasswordValid = (password) => {
    const criteriaMet = {
        symbol: /[^a-zA-Z0-9]/.test(password),
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        noSpaces: !/\s/.test(password),
        minSize: password.length >= 10
    };
    return Object.values(criteriaMet).every(Boolean);
};



// ==========================================
// 3. UX - FEEDBACK VISUAL EM TEMPO REAL
// ==========================================
const updateUI = (element, isValid) => {
    if (!element) return; // Segurança
    element.classList.remove('border-green-500', 'border-red-500', 'border-2');
    if (element.value.length > 0) {
        element.classList.add('border-2');
        element.classList.add(isValid ? 'border-green-500' : 'border-red-500');
    }
};

// Adiciona os eventos de digitação APENAS se os elementos existirem na tela
if (inputName) {
    inputName.addEventListener('input', () => updateUI(inputName, isNameValid(inputName.value)));
}

if (inputEmail) {
    inputEmail.addEventListener('input', () => updateUI(inputEmail, isEmailValid(inputEmail.value)));
}

if (inputPassword) {
    inputPassword.addEventListener('input', () => updateUI(inputPassword, isPasswordValid(inputPassword.value)));
}



// ==========================================
// 4. LÓGICA DE REGISTRO (registerUser.html)
// ==========================================
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault(); // Trava o recarregamento
        console.log("🚀 Tentando registrar...");

        const valid = isNameValid(inputName.value) && 
                      isEmailValid(inputEmail.value) && 
                      isPasswordValid(inputPassword.value);

        if (!valid) {
            alert('Por favor, preencha todos os campos corretamente de acordo com os critérios (bordas verdes).');
            return;
        }

        const usersList = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        const emailExists = usersList.some(user => user.email === inputEmail.value);
        if (emailExists) {
            alert('Este email já está em uso!');
            return;
        }

        const newUser = {
            name: inputName.value,
            email: inputEmail.value,
            password: inputPassword.value 
        };

        usersList.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(usersList));
        
        alert('Conta criada com sucesso!');
        setTimeout(() => { window.location.href = 'login.html'; }, 100);
    });
}



// ==========================================
// 5. LÓGICA DE LOGIN (login.html)
// ==========================================
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // Trava o recarregamento da página

        // Puxa a lista de usuários do "banco de dados" do navegador
        const usersList = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // BARREIRA 1: O sistema não tem nenhum usuário cadastrado ainda
        if (usersList.length === 0) {
            alert('Nenhum usuário registrado no sistema. Por favor, crie uma conta primeiro.');
            window.location.href = 'registerUser.html';
            return; 
        }

        // BARREIRA 2: Busca na lista se o email digitado existe
        const userFound = usersList.find(user => user.email === inputEmail.value);
        
        if (!userFound) {
            // Se o userFound for indefinido (não achou)
            alert('Usuário não encontrado. Verifique se digitou o email corretamente.');
            updateUI(inputEmail, false); 
            return;
        }

        // BARREIRA 3: O email existe, mas a senha está errada
        if (userFound.password !== inputPassword.value) {
            alert('Senha incorreta! Tente novamente.');
            updateUI(inputPassword, false); 
            return;
        }

        
        alert('Login bem-sucedido! Bem-vindo(a), ' + userFound.name);
        
        // Salva quem é o usuário atual logado.
        localStorage.setItem('currentUser', JSON.stringify(userFound));
        
        // Redireciona para a página principal.
        window.location.href = 'index.html';
    });
}




// ==========================================
// 6. FUNÇÕES GLOBAIS (Dashboard / Produtos)
// ==========================================
function toggleModal() {
    const modal = document.getElementById('productModal');
    if (modal) { // Só executa se o modal existir na tela (products.html)
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
        if(modal.classList.contains('flex')) {
            const inputProd = document.getElementById('inputProductName');
            if(inputProd) inputProd.focus();
        }
    }
}