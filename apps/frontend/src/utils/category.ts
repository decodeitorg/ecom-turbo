const ParentAndChildrenCategory = (categories, parentId = null) => {
  categories = JSON.parse(JSON.stringify(categories));
  const categoryList = [];
  let Categories;
  if (parentId == null) {
    Categories = categories.filter((cat) => cat.parentId == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of Categories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      youtubeLink: cate.youtubeLink,
      status: cate.status,
      children: ParentAndChildrenCategory(categories, cate._id),
    });
  }

  return categoryList;
};
export default ParentAndChildrenCategory;
