class Alumno {
    constructor(nombre, apellido, nota1, nota2, nota3) {
        this.nombre = nombre
        this.apellido = apellido
        this.nota1 = nota1
        this.nota2 = nota2
        this.nota3 = nota3
    }
}

const alumnos = [];

const filtroAprobar = alumno => {
    const promedio = (parseFloat(alumno.nota1) + parseFloat(alumno.nota2) + parseFloat(alumno.nota3)) / 3;
    return promedio >= 7;
};

const filtroDesaprobar = alumno => {
    const promedio = (parseFloat(alumno.nota1) + parseFloat(alumno.nota2) + parseFloat(alumno.nota3)) / 3;
    return promedio < 7;
};


function sacarPromedio() {

    const cantidadAlumnos = parseInt(prompt("CANTIDAD DE ALUMNOS:"))

    for (let i = 0; i < cantidadAlumnos; i++) {

        const nombre = prompt("NOMBRE DE ALUMNO:")

        const apellido = prompt("APELLIDO DEL ALUMNO:")

        const nota1 = parseFloat(prompt("PRIMERA NOTA DEL EXAMEN"))

        const nota2 = parseFloat(prompt("NOTA DEL SEGUNDO EXAMEN"))

        const nota3 = parseFloat(prompt(" NOTA DEL TERCER EXAMEN"))

        const alumnosIngresados = new Alumno(nombre, apellido, nota1, nota2, nota3);

        alumnos.push(alumnosIngresados);
    }

    const trimestreAprobado = alumnos.filter(filtroAprobar);
    const trimestreDesaprobado = alumnos.filter(filtroDesaprobar);

    console.log("todos los alumnos" + ' ' + alumnos.length)

    console.log(alumnos)

    console.log("CANTIDAD DE ALUMNOS QUE APROBARON EL TRIMESTRE" +  ''  + trimestreAprobado.length);


    for (const trimestreAprobado of trimestreAprobado) {
        console.log(trimestreAprobado.nombre, trimestreAprobado.apellido);
    }

    console.log("CANTIDAD DE ALUMNOS Q DESAPROBARON EL TRIMESTRE" +  ''  + trimestreDesaprobado.length);

    for (const trimestreDesaprobado of trimestreDesaprobado) {
        console.log(trimestreDesaprobado.nombre, trimestreDesaprobado.apellido);
    }
}
sacarPromedio()