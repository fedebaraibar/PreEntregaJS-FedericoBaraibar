function notas(notas1, nota2, nota3){
    const sumaDeNotas = nota1 + nota2 + nota3
    const notaFinal = sumaDeNotas / 3
    if(notaFinal >= 7){
        alert( notaFinal + ' TE FELICITO APROBASTE EL TRIMESTRE')
    }
    else{
        alert( notaFinal + ' PONETE A ESTUDIAR YAAA')
    }
}

alert('CONOCE TU PROMEDIO')
const nota1 = parseFloat(prompt('INGRESA SU PRIMERA NOTA'))
const nota2 = parseFloat(prompt('INGRESE SU SEGUNDA NOTA'))
const nota3 = parseFloat(prompt('INGRESE SU TERCERA NOTA'))

notas(nota1, nota2, nota3)