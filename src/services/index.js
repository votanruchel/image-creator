const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');


exports.createImage = async(req, res) => {

    const { background_selected, font_color, title, requirements, benefits, description, salary } = req.body;
    title.replace(/(\r\n|\n|\r)/gm, " ");
    requirements.replace(/(\r\n|\n|\r)/gm, " ");
    description.replace(/(\r\n|\n|\r)/gm, " ");
    salary.replace(/(\r\n|\n|\r)/gm, " ");
    if (!background_selected) {
        console.log('O titulo precisa ter 30 caracteres ou menos.')
        res.status(200).json({ message: 'É necessário selecionar um background!' });
        return
    }
    if (title.length > 30) {
        console.log('O titulo precisa ter 30 caracteres ou menos.')
        res.status(200).json({ message: 'O titulo precisa ter 30 caracteres ou menos.' });
        return
    }
    if (description.length > 200) {
        console.log('A descricao precisa ter 200 caracteres ou menos.')
        res.status(200).json({ message: 'A descricao precisa ter 200 caracteres ou menos.' });
        return
    }
    if (requirements.length > 100) {
        console.log('Os requerimentos precisam ter 100 caracteres ou menos.')
        res.status(200).json({ message: 'Os requerimentos precisam ter 100 caracteres ou menos.' });
        return
    }
    if (salary.length > 50) {
        console.log('O salario precisa ter 50 caracteres ou menos.')
        res.status(200).json({ message: 'O salario precisa ter 50 caracteres ou menos.' });
        return
    }


    let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    let fontDescription = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

    if (font_color === 'white') {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        fontDescription = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    }



    const background = await Jimp.read(__dirname + '/../public/backgrounds/' + background_selected + '.jpg').then(res => {
        console.log(`Image Loaded!`);
        return res;
    }).catch(err => {
        console.log(err);
    });

    const backgroundResized = await background.resize(530, 300);

    backgroundResized.print(
            font,
            0,
            25, {
                text: `  ${title.toUpperCase()} `,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            },
            530,
            300
        )
        .print(
            fontDescription,
            0,
            125, {
                text: `  ${description}`,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            },
            530,
            300
        )
        .print(
            fontDescription,
            0,
            210, {
                text: `${(requirements != null)?'Requisitos: '+requirements:'' }`,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            },
            530,
            300
        )
        .print(
            fontDescription,
            0,
            270, {
                text: `  ${salary}`,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            },
            530,
            300
        );
    const imgName = uuidv4() + '.' + background.getExtension();
    await backgroundResized.quality(100).write(__dirname + '/../public/imageOutputs/' + imgName);
    res.status(201).json({ status: true, message: imgName });
}

// main(null,
//     'Contrata-se casal de caseiros',
//     'Experiência na função ou como trabalhador rural. O casal deve ter atestado de boa conduta ',
//     null,
//     'Preciso de um casal responsável, para tomar conta de um de meus imoveis . Tenho urgência ,pois estou de viagem para o exterior. o casal que se enquadrar no perfil ,por fazer cadastro no site abaixo.',
//     'Salário de até  R$ 4.000,00 a combinar'
// );