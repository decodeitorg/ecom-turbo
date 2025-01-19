import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TypographyH2 } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  $attributes,
  $attributesLoading,
  $attributesError,
  refetchAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
  addAttributeVariant,
  updateAttributeVariant,
  deleteAttributeVariant,
  updateAttributeVariants,
} from "@/store/attributes";
import { toast } from "react-toastify";
import Breadcamb from "@/layout/Breadcamb";

export default function Attributes() {
  const attributes = useStore($attributes);
  const isLoading = useStore($attributesLoading);
  const error = useStore($attributesError);
  if (error) toast.error(error);

  const [attributeDialogState, setAttributeDialogState] = useState({
    isOpen: false,
    mode: "",
    id: "",
    name: "",
  });
  const [variantDialogState, setVariantDialogState] = useState({
    isOpen: false,
    mode: "",
    attributeId: "",
    id: "",
    name: "",
  });

  const handleAttributeAction = async () => {
    const { mode, id, name } = attributeDialogState;
    try {
      if (mode === "add") {
        await addAttribute(name);
      } else if (mode === "edit") {
        await updateAttribute(id, name);
      } else if (mode === "delete") {
        await deleteAttribute(id);
      }
      toast.success(`Attribute ${mode}ed successfully`);
    } catch (error: any) {
      toast.error(error.message);
    }
    setAttributeDialogState({ isOpen: false, mode: "", id: "", name: "" });
    refetchAttributes();
  };

  const handleVariantAction = async () => {
    const { mode, attributeId, id, name } = variantDialogState;
    try {
      if (mode === "add") {
        await addAttributeVariant(attributeId, name);
      } else if (mode === "edit") {
        await updateAttributeVariant(attributeId, id, name);
      } else if (mode === "delete") {
        await deleteAttributeVariant(attributeId, id);
      }
      toast.success(`Variant ${mode}ed successfully`);
    } catch (error: any) {
      toast.error(error.message);
    }
    setVariantDialogState({
      isOpen: false,
      mode: "",
      attributeId: "",
      id: "",
      name: "",
    });
    refetchAttributes();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <section>
      <Breadcamb items={[{ label: "Attributes" }]} />
      <div className="flex items-center justify-between gap-4">
        <TypographyH2>Attributes</TypographyH2>
        <div className="flex items-center justify-end gap-3">
          <Button onClick={refetchAttributes} color="primary" variant="outline">
            Refresh
          </Button>
          <Button
            onClick={() =>
              setAttributeDialogState({
                isOpen: true,
                mode: "add",
                id: "",
                name: "",
              })
            }
            color="primary"
          >
            Add New Attribute
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {attributes?.map((attribute) => (
          <Card key={attribute._id}>
            <CardHeader>
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center justify-start gap-2">
                  <h4 className="text-lg font-semibold">{attribute.name}</h4>
                  <FaRegEdit
                    onClick={() =>
                      setAttributeDialogState({
                        isOpen: true,
                        mode: "edit",
                        id: attribute._id,
                        name: attribute.name,
                      })
                    }
                  />
                  <MdDelete
                    onClick={() =>
                      setAttributeDialogState({
                        isOpen: true,
                        mode: "delete",
                        id: attribute._id,
                        name: attribute.name,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={() =>
                    setVariantDialogState({
                      isOpen: true,
                      mode: "add",
                      attributeId: attribute._id,
                      id: "",
                      name: "",
                    })
                  }
                  color="primary"
                  variant="outline"
                >
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {attribute?.variants?.map((variant) => (
                <div
                  key={variant._id}
                  className="flex items-center justify-between"
                >
                  <p className="w-40">{variant.name}</p>
                  <div className="flex justify-end gap-2">
                    <FaRegEdit
                      onClick={() =>
                        setVariantDialogState({
                          isOpen: true,
                          mode: "edit",
                          attributeId: attribute._id,
                          id: variant._id,
                          name: variant.name,
                        })
                      }
                      className="hover:text-blue-500"
                    />
                    <MdDelete
                      onClick={() =>
                        setVariantDialogState({
                          isOpen: true,
                          mode: "delete",
                          attributeId: attribute._id,
                          id: variant._id,
                          name: variant.name,
                        })
                      }
                      className="hover:text-red-500"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attribute Dialog */}
      <Dialog
        open={attributeDialogState.isOpen}
        onOpenChange={(isOpen) =>
          setAttributeDialogState((prev) => ({ ...prev, isOpen }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {attributeDialogState.mode === "add"
                ? "Add New Attribute"
                : attributeDialogState.mode === "edit"
                  ? "Edit Attribute"
                  : "Delete Attribute"}
            </DialogTitle>
          </DialogHeader>
          {attributeDialogState.mode !== "delete" && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={attributeDialogState.name}
                  onChange={(e) =>
                    setAttributeDialogState((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          {attributeDialogState.mode === "delete" && (
            <p>
              Are you sure you want to delete the attribute "
              {attributeDialogState.name}"?
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setAttributeDialogState({
                  isOpen: false,
                  mode: "",
                  id: "",
                  name: "",
                })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleAttributeAction}>
              {attributeDialogState.mode === "add"
                ? "Add"
                : attributeDialogState.mode === "edit"
                  ? "Save"
                  : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant Dialog */}
      <Dialog
        open={variantDialogState.isOpen}
        onOpenChange={(isOpen) =>
          setVariantDialogState((prev) => ({ ...prev, isOpen }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {variantDialogState.mode === "add"
                ? "Add New Variant"
                : variantDialogState.mode === "edit"
                  ? "Edit Variant"
                  : "Delete Variant"}
            </DialogTitle>
          </DialogHeader>
          {variantDialogState.mode !== "delete" && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variantName" className="text-right">
                  Name
                </Label>
                <Input
                  id="variantName"
                  value={variantDialogState.name}
                  onChange={(e) =>
                    setVariantDialogState((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          {variantDialogState.mode === "delete" && (
            <p>
              Are you sure you want to delete the variant "
              {variantDialogState.name}"?
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setVariantDialogState({
                  isOpen: false,
                  mode: "",
                  attributeId: "",
                  id: "",
                  name: "",
                })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleVariantAction}>
              {variantDialogState.mode === "add"
                ? "Add"
                : variantDialogState.mode === "edit"
                  ? "Save"
                  : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
