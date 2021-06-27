let CategoryDesign = require('../models/store_design/categoryDesign.model');
let mongoose = require('mongoose')
let Category = require('../models/category.model');
let TextDesign = require('../models/store_design/textDesign.model');


const newCategoryDesign = async (req, res) => {
    const { categoryData, imageCategory, statusShow, textContent, textSize, textAlignment, display, textColor, paddingTop, indexInMenu } = req.body;

    let c = await Category.findById(categoryData);

    const textCategory = await new TextDesign({
        textContent: textContent,
        textSize: textSize,
        textAlignment: textAlignment,
        display: display,
        textColor: textColor,
        paddingTop: paddingTop
    })
    await textCategory.save();

    const createCategoryDesign = new CategoryDesign({
        categoryData: categoryData,
        imageCategory: imageCategory,
        statusShow: statusShow,
        categoryTitle: textCategory,
        indexInMenu: indexInMenu
    })
    createCategoryDesign.save().then(cd => {
        console.log("Category design created", cd)
        Category.findById(cd.categoryData).then(
            categoryData => {
                if (categoryData) { categoryData.categoryDesign = cd._id; }
                categoryData.save()
                    .then(c => console.log("Category " + c.categoryName + " saved with category design"))
                    .catch(console.error("error"))
            })
        res.status(200).json({
            _id: cd._id,
            categoryData: cd.categoryData,
            imageCategory: cd.imageCategory,
            statusShow: cd.statusShow,
            categoryTitle: textCategory
        })
    }
    ).catch((error) => {
        console.error("cant create new category design", error);
        res.status(400).json(error)

    })
}


const editCategoryDesign = async (req, res) => {

    const body = req.body;

    try {

        const newCategoryDesign = await CategoryDesign.findByIdAndUpdate(req.params.id, body, { new: true });

        const titleD = await TextDesign.findByIdAndUpdate(newCategoryDesign.categoryTitle._id, body.categoryTitle, { new: true });
        await titleD.save().then(tt => console.log("titleD", tt))

        await newCategoryDesign.save().then(ncd => console.log("newCategoryDesign Saved!", ncd));

        if (newCategoryDesign) {
            res.status(201).json({
                _id: newCategoryDesign._id,
                categoryData: newCategoryDesign.categoryData,
                imageCategory: newCategoryDesign.imageCategory,
                statusShow: newCategoryDesign.statusShow,
                indexInMenu: newCategoryDesign.indexInMenu,
                categoryTitle: titleD
            });

        }
    }
    catch (err) {
        console.error(err)
        res.status(500).send(err)
    }

}

module.exports = {
    newCategoryDesign,
    editCategoryDesign
}
