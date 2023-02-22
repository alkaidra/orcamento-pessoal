class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == null || this[i] == undefined || this[i] == '') {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');
        if (id == null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(despesa) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(despesa));
        localStorage.setItem('id', id);
    }

    recuperarRegistros() {
        let despesas = [];
        let id = localStorage.getItem('id');
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));
            if (despesa == null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = [];
        despesasFiltradas = this.recuperarRegistros();
        if (despesa.ano != '') {
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if (despesa.mes != '') {
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        
        if (despesa.dia != '') {
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if (despesa.tipo != '') {
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        
        if (despesa.descricao != '') {
            console.log('filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        
        if (despesa.valor != '') {
            console.log('filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }
        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
        window.location.reload();
    }
}

var bd = new Bd();

function cadastrarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    if (despesa.validarDados()) {
        bd.gravar(despesa);
        document.getElementById('modalTitulo').className = 'text-success';
        document.getElementById('modalVoltar').className = 'btn btn-success';
        document.getElementById('modalTitulo').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modalMensagem').innerHTML = 'Despesa cadastrada com sucesso!';
        $('#modalRegistroDespesa').modal('show');
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else {
        document.getElementById('modalTitulo').className = 'text-danger';
        document.getElementById('modalVoltar').className = 'btn btn-danger';
        document.getElementById('modalTitulo').innerHTML = 'Erro na Gravação';
        document.getElementById('modalMensagem').innerHTML = 'Existem campos obrigatórios que não foram preenchidos';
        $('#modalRegistroDespesa').modal('show');
    }
}

function carregaListaDespesas(despesas = [], filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarRegistros();
    }

    let listasDepesas = document.getElementById('listasDepesas');
    listasDepesas.innerHTML = '';

    despesas.forEach(function (d) {
        //cria linhas
        let linha = listasDepesas.insertRow();
        //cria colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        switch (parseInt(d.tipo)) {
            case 1:
                d.tipo = 'Alimentação';
                break;
            case 2:
                d.tipo = 'Educação';
                break;
            case 3:
                d.tipo = 'Lazer';
                break;
            case 4:
                d.tipo = 'Saúde';
                break;
            case 5:
                d.tipo = 'Transporte';
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `despesaId${d.id}`;
        btn.onclick = function(){
            let id = this.id.replace('despesaId', '');
            console.log(id)
            bd.remover(id);
        };
        linha.insertCell(4).append(btn);
    });
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    
    let despesas = [];
    despesas = bd.pesquisar(despesa);

    carregaListaDespesas(despesas, true);
}