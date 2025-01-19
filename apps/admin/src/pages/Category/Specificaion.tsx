import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { putData, useFetchData } from "@/hooks/hook";
import BurgerButton from "@/layout/navbar/burguer-button";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function Specification() {
  let { _id } = useParams();
  let [category, getCategory] = useFetchData(
    "/api/admin/categories/category",
    {},
    false
  );

  const [specifications, setSpecifications] = useState([]);
  const [specificationType, setSpecificationType] = useState(
    category?.specificationType || "same_as_parent"
  );

  useEffect(() => {
    if (_id?.length === 24) getCategory({ _id });
  }, [_id]);

  useEffect(() => {
    setSpecifications(category?.specification || []);
    setSpecificationType(category?.specificationType || "same_as_parent");
  }, [category]);

  const handleSave = () => {
    let payload = {
      _id,
      specification: specifications,
      specificationType,
    };

    putData("/api/admin/categories", payload);
  };

  return (
    <section className="container">
      <br />
      <div className="flex items-center justify-start gap-4">
        <img
          src={category?.icon ?? "/images/no-image.png"}
          alt={category?.name}
          width={100}
          height={100}
        />
        <a
          href={`/admin/products/categories/${category?._id}`}
          className="text-blue-500"
        >
          <h1 className="text-xl font-semibold">{category?.name}</h1>
        </a>
      </div>

      <br />

      <RadioGroup
        onValueChange={(value) => {
          setSpecificationType(value);
        }}
        value={specificationType}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="same_as_parent">Same as parent</RadioGroupItem>
          <Label htmlFor="same_as_parent">Same as parent</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="unique">Unique</RadioGroupItem>
          <Label htmlFor="unique">Unique</Label>
        </div>
      </RadioGroup>
      <br />
      <br />
      {specificationType === "unique" && (
        <>
          <div className="flex justify-end">
            <Button
              color="primary"
              onClick={() => {
                //ask user for the name of the specification
                let name = prompt("Enter the name of the specification");
                if (name) {
                  setSpecifications([
                    ...specifications,
                    { name, inputFields: [] },
                  ]);
                }
              }}
            >
              Add New Specification
            </Button>
          </div>
          <br />
          {specificationType === "unique" && (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {specifications.map((specification, index) => (
                <div key={index}>
                  <Card>
                    <CardHeader>
                      <div className="items-cente flex w-full justify-between gap-2">
                        <div className="flex items-center justify-start gap-2">
                          <h4 className="text-lg font-semibold">
                            {specification.name}
                          </h4>{" "}
                          <FaRegEdit
                            onClick={() => {
                              let newName = prompt("Enter new name");
                              if (newName) {
                                setSpecifications(
                                  specifications.map((spec) => {
                                    if (spec.name === specification.name) {
                                      return { ...spec, name: newName };
                                    } else {
                                      return spec;
                                    }
                                  })
                                );
                              }
                            }}
                          />
                          <MdDelete
                            onClick={() => {
                              setSpecifications(
                                specifications.filter(
                                  (spec) => spec.name !== specification.name
                                )
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Button
                            color="primary"
                            variant="faded"
                            onClick={() => {
                              //take input then add to the inputFields
                              let text = prompt("Enter field text");
                              if (text) {
                                setSpecifications(
                                  specifications.map((spec) => {
                                    if (spec.name === specification.name) {
                                      return {
                                        ...spec,
                                        inputFields: [
                                          ...spec.inputFields,
                                          text,
                                        ],
                                      };
                                    } else {
                                      return spec;
                                    }
                                  })
                                );
                              }
                            }}
                          >
                            Add Field
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardContent>
                      {specification.inputFields.map((inputField, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <p>{inputField}</p>
                          <div className="flex justify-end gap-2">
                            <FaRegEdit
                              className="hover:text-blue-500"
                              onClick={() => {
                                let newText = prompt("Enter new text");
                                if (newText) {
                                  setSpecifications(
                                    specifications.map((spec) => {
                                      if (spec.name === specification.name) {
                                        return {
                                          ...spec,
                                          inputFields: spec.inputFields.map(
                                            (field) => {
                                              if (field === inputField) {
                                                return newText;
                                              } else {
                                                return field;
                                              }
                                            }
                                          ),
                                        };
                                      } else {
                                        return spec;
                                      }
                                    })
                                  );
                                }
                              }}
                            />
                            <MdDelete
                              className="hover:text-red-500"
                              onClick={() => {
                                setSpecifications(
                                  specifications.map((spec) => {
                                    if (spec.name === specification.name) {
                                      return {
                                        ...spec,
                                        inputFields: spec.inputFields.filter(
                                          (field) => field !== inputField
                                        ),
                                      };
                                    } else {
                                      return spec;
                                    }
                                  })
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className="flex justify-end pt-12">
        <Button color="primary" variant="shadow" onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
}
