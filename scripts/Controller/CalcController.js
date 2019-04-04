class CalcController{

	constructor(){

		this._audio = new Audio('click.mp3');
		this._audioOnOff = false;
		this._lastOperator = '';
		this._lastNumber = '';

		this._operation = []; //deposita os numeros e operações
		this._locale = 'pt-BR';
		this._displayCalEl = document.querySelector("#display"); //pega o elemento display assim q inicia
		this._dateEl = document.querySelector("#date"); //pega o elemento data assim q inicia
		this._timeEl = document.querySelector("#time"); // pega o elemento tempo assim q inicia
		this._currentDate; //define Date
		this.initialize(); //chama o comportamento inicial no metodo abaixo
		this.initButtonsEvents(); 
		this.initKeyboard();
	}

	copyToClipboard(){

		let input = document.createElement('input');

		input.value = this.displayCalc;

		document.body.appendChild(input);

		input.select();

		document.execCommand("Copy");

		input.remove();

	}

	pasteFromClipboard(){

		document.addEventListener('paste', e =>{

			let text = e.clipboardData.getData('Text');

			this.displayCalc = parseFloat(text);

			console.log(text);

		});
	}

	initialize(){


		this.setDisplayDateTime();

		setInterval(()=>{

			this.setDisplayDateTime();

		},1000);

		// setTimeout(()=>{

		// 	clearInterval(interval);

		// },10000);

		this.setLastNumberToDisplay();

		this.pasteFromClipboard();

		let bta = document.querySelector('#ce');

			bta.addEventListener('dblclick', e =>{

				this.toogleAudio();

			});

		
	}

	toogleAudio(){

		this._audioOnOff = !this._audioOnOff; //se tiver ligado ele vai desligar e vice versa

	}

	playAudio(){

		if(this._audioOnOff){

			this._audio.currentTime = 0;

			this._audio.play();
		}
	}

	initKeyboard(){


		this.playAudio();

		document.addEventListener('keyup', e =>{

			switch(e.key){ // e é o evento e key é a tecla q esta sendo teclada
				case 'Escape':
					this.clearAll();
				break;
	
				case 'Backspace':
					this.clearEntry();
				break;
					
				case 'milhar':
				
				break;
	
				case 'maismenos':
	
				break;
	
				case 'volta':
	
				break;
	
				case '.':
				case ',':
					this.addDot();
				break;
	
				case 'raiz':
	
				break;
	
				case 'quadrado':
	
				break;
	
				case '+':
				case '-':
				case '/':
				case '*':	
				case '%':
					this.addOperation(e.key); //e.key retorna o mesmo value da tecla
				break;
	
				case 'Enter':
				case '=':
					this.calc();
				break;
	
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					this.addOperation(parseInt(e.key));
				break;

				case 'c':
					if(e.ctrlKey) this.copyToClipboard();
				break;
			}
		});
	}

	addEventListenerAll(element, events, fn){//receberá os elementos,os eventos em string e a função q executará

		events.split(' ').forEach(event=>{ //formará um array com os elementos

			element.addEventListener(event, fn); //para cada evento em no array events será adicionado um comportamento no elemento enviado
			//não é necessario false 

		});

	}

	clearAll(){

		this._operation = [];

		this._lastNumber = '';

		this._lastOperator = '';

		this.setLastNumberToDisplay();

	}

	clearEntry(){

		this._operation.pop();

		this.setLastNumberToDisplay();

	}

	setError(){
		this.displayCalc = "ERROR";
	}

	getLastOperation(){//vai pegar a ultima operação ou numero inserido na calculadora

		return this._operation[this._operation.length-1];

	}

	setLastOperation(value){

		this._operation[this._operation.length-1] = value;

	}

	isOperator(value){

		return (['+','-','%','*','/'].indexOf(value) > -1); //vai procurar nos index do array o valor selecionado.. se achar retorna true
		//retorna true ou false 
	}

	pushOperation(value){

		this._operation.push(value);

		if(this._operation.length > 3){			

			this.calc();

		}

	}

	getResult(){

		try{

			return eval(this._operation.join(""));; //vai juntar os 3 elementos do array em uma string

		}catch(e){

			setTimeout(()=>{
				this.setError();
			},1);

		}
	}	
		

	calc(){
		let last = '';

		this._lastOperator = this.getLastItem();

		if(this._operation.length<3){

			let firstItem = this._operation[0];
			this._operation = [firstItem, this._lastOperator, this._lastNumber];
		}

		if(this._operation.length > 3){

			last = this._operation.pop();

			this._lastNumber = this.getResult(); //pega operador

		}else if(this._operation.length == 3){
			
			this._lastNumber = this.getLastItem(false); //pega numero

		}

		
		let result = this.getResult(); 

		if(last == '%'){

			result /= 100;

			this._operation = [result];

		}else{
			

			this._operation = [result];

			if(last) this._operation.push(last);

			
		}
		this.setLastNumberToDisplay();
	}

	getLastItem(isOperator = true){ //false é number

		let lastItem;

		for(let i = this._operation.length-1; i >= 0; i--){

			if(this.isOperator(this._operation[i]) == isOperator){
				lastItem = this._operation[i];
				break;
			}
		}

		if(!lastItem){

			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

		}
		return lastItem;
		}

	setLastNumberToDisplay(){

		let lastNumber = this.getLastItem(false);

		if(!lastNumber) lastNumber = 0;

		this.displayCalc = lastNumber;

	}


	addOperation(value){

		if(isNaN(this.getLastOperation())){//string

			if(this.isOperator(value)){ //trocar operador

				this.setLastOperation(value);

			}  else {

				this.pushOperation(value);

				this.setLastNumberToDisplay();
			}

		}else{//numero

			if(this.isOperator(value)){

				this.pushOperation(value);

			}
			else{

				let newValue = this.getLastOperation().toString() + value.toString();
				this.setLastOperation(newValue);

				//atualizar display
				this.setLastNumberToDisplay();

			}
			
		}

	}

	addDot(){

		let lastOperation = this.getLastOperation();

		if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

		if(this.isOperator(lastOperation) || !lastOperation){ //se não existir numero inserido ou se for uma operação o 0 deve recever uma casa decimal
			this.pushOperation('0.');
		}
		else{
			this.setLastOperation(lastOperation.toString() + '.');
		}
		this.setLastNumberToDisplay();
	}


	execBtn(value){ //recebe o botão detectado e tratara o evento de cada um		
		this.playAudio();

		switch(value){
			case 'ce':
				this.clearAll();
			break;

			case 'c':
				this.clearEntry();
			break;
				
			case 'milhar':
			
			break;

			case 'maismenos':

			break;

			case 'volta':

			break;

			case 'ponto':
				this.addDot();
			break;

			case 'raiz':

			break;

			case 'quadrado':

			break;

			case 'soma':
				this.addOperation('+');
			break;

			case 'subtracao':
				this.addOperation('-');
			break;

			case 'divisao':
				this.addOperation('/');
			break;

			case 'multiplicacao':
				this.addOperation('*');
			break;
				
			case 'porcento':
				this.addOperation('%'); //isso na verdade é o calculo do módulo... resto de uma divisão

			break;

			case 'igual':
				this.calc();
			break;

			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				this.addOperation(parseInt(value));
			break;


			default: this.setError();
		}

	}

	initButtonsEvents(){ //adiciona eventos aos botoes e outros comportamentos

		let buttons = document.querySelectorAll(".container > .row > button"); //seleciona todos os botoes que estão dentro da classe row

		buttons.forEach((btn, index)=>{

			this.addEventListenerAll(btn,'click drag',(e)=>{

				let textBtn = btn.id; //não esquecer de formatar a saida

				// console.log(textBtn);

				this.execBtn(textBtn);
			});
			
			this.addEventListenerAll(btn, 'mouseover mouseup mousedown', (e) =>{
  
				btn.style.cursor = "pointer"; //não seria necessario pois são buttons

			});
		});
	}

	setDisplayDateTime(){

			this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
			day: "2-digit",
			month:"long",
			year: "numeric"
			}); // pega o displayDate e coloca o valor da instancia currentDate no formato selecionado
			this.displayTime = this.currentDate.toLocaleTimeString(this._locale); // pega o displayTime e coloca o valor da instancia currentDate no formato selecionado
	}

	get displayTime(){
		return this._timeEl.innerHTML; // retorna um valor e controis um elemento HTML 
	}

	set displayTime(value){
		this._timeEl.innerHTML = value; //coloca um valor no elemento
	}

	get displayDate(){
		return this._dateEl.innerHTML; //retorna um valor e controis um elemento HTML 
	}

	set displayDate(value){
		this._dateEl.innerHTML = value; //coloca um valor no elemento
	}

	get displayCalc(){
		return this._displayCalEl.innerHTML; //retorna um valor e controis um elemento HTML 
	}

	set displayCalc(value){

		if(value.toString().length > 10){
			this.setError();
			return false;
		}
		this._displayCalEl.innerHTML = value;
	}

	get currentDate(){
		// dt.toLocaleDateString('pt-BR') retorna em pt-br uma variavel instanciada com objeto new date
		// pode ser timestring tambem
		// dt.toLocaleDateString('pt-BR',{month:'long'}) ou short
		return new Date(); //classe nativa dp js q retorna um dia e hora de acordo com a formatação desejada
	}

	set currentDate(value){
		this._currentDate = value;
	}

}