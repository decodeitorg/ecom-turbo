import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { $SettingData, postSettingData } from "@/store/settings";
import { useStore } from "@nanostores/react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import Breadcamb from "@/layout/Breadcamb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getApiUrl } from "@/lib/utils";

export default function Settings() {
    const settingData = useStore($SettingData);

    const initialValues = {
        takeShippingFeeAdvance: false,
        shippingLocationFee: [],
        sslCommerz: {
            isSslCommerzEnabled: false,
            storeId: "",
            storePassword: "",
            isLive: false,
        },
        steadFast: {
            isSteadfastEnabled: false,
            apiKey: "",
            secretKey: "",
        },
        facebookPixel: {
            pixelId: "",
            accessToken: "",
            test_event_code: "",
        },
        timeZone: "",
    };

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            try {
                await postSettingData(values);
                toast.success("Settings saved successfully");
            } catch (error) {
                toast.error(error.message);
            }
        },
    });

    useEffect(() => {
        if (settingData) {
            formik.setValues({
                takeShippingFeeAdvance:
                    settingData?.takeShippingFeeAdvance || false,
                shippingLocationFee: settingData?.shippingLocationFee || [],
                sslCommerz: settingData?.sslCommerz || initialValues.sslCommerz,
                steadFast: settingData?.steadFast || initialValues.steadFast,
                facebookPixel:
                    settingData?.facebookPixel || initialValues.facebookPixel,
                timeZone: settingData?.timeZone || "",
            });
        }
    }, [settingData]);
    return (
        <>
            <Breadcamb items={[{ label: "Settings" }]} />
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                <ShippingLocationFee formik={formik} />
                <SteadFastSettings formik={formik} />
                <HandleSSLCOMMERZ formik={formik} />
                <HandleFacebookPixel formik={formik} />
                <TimeZone formik={formik} />
            </div>
        </>
    );
}

const ShippingLocationFee = ({ formik }) => {
    const handleInputChange = (
        index: number,
        field: "location" | "fee",
        value: string
    ) => {
        const newPairs = [...formik.values.shippingLocationFee];
        newPairs[index][field] = value;
        formik.setFieldValue("shippingLocationFee", newPairs);
    };

    const addNewPair = () => {
        formik.setFieldValue("shippingLocationFee", [
            ...formik.values.shippingLocationFee,
            { location: "", fee: "" },
        ]);
    };

    const removePair = (index: number) => {
        const newPairs = formik.values.shippingLocationFee.filter(
            (_, i) => i !== index
        );
        formik.setFieldValue("shippingLocationFee", newPairs);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shipping Fee Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                >
                    {formik.values.shippingLocationFee?.map((pair, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2"
                        >
                            <Input
                                placeholder="Location"
                                value={pair.location}
                                onChange={(e) =>
                                    handleInputChange(
                                        index,
                                        "location",
                                        e.target.value
                                    )
                                }
                                className="flex-grow"
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Fee"
                                value={pair.fee}
                                onChange={(e) =>
                                    handleInputChange(
                                        index,
                                        "fee",
                                        e.target.value
                                    )
                                }
                                className="w-24"
                                required
                            />
                            <Button
                                variant="destructive"
                                onClick={() => removePair(index)}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}

                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={addNewPair}
                        >
                            Add New
                        </Button>
                        <Button variant="outline" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
                <Separator className="my-3" />
                <div className="flex items-center space-x-2">
                    <Switch
                        id="take-shipping-fee-advance"
                        checked={formik.values.takeShippingFeeAdvance}
                        onCheckedChange={(checked) =>
                            formik.setFieldValue(
                                "takeShippingFeeAdvance",
                                checked
                            )
                        }
                    />
                    <label htmlFor="take-shipping-fee-advance">
                        Take Shipping Fee Advance (First enable SSLCOMMERZ
                        Payment)
                    </label>
                </div>
            </CardContent>
        </Card>
    );
};

const SteadFastSettings = ({ formik }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>SteadFast Courier Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="steadfast-enabled"
                            checked={formik.values.steadFast.isSteadfastEnabled}
                            onCheckedChange={(checked) =>
                                formik.setFieldValue(
                                    "steadFast.isSteadfastEnabled",
                                    checked
                                )
                            }
                        />
                        <label htmlFor="steadfast-enabled">
                            Enable SteadFast
                        </label>
                    </div>
                    {formik.values.steadFast.isSteadfastEnabled && (
                        <>
                            <Input
                                value={formik.values.steadFast.apiKey}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "steadFast.apiKey",
                                        e.target.value
                                    )
                                }
                                placeholder="API Key"
                                required
                            />
                            <Input
                                value={formik.values.steadFast.secretKey}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "steadFast.secretKey",
                                        e.target.value
                                    )
                                }
                                placeholder="Secret Key"
                                required
                            />
                            <div className="flex items-center space-x-2">
                                <label htmlFor="is-live">
                                    Callback:{" "}
                                    <span className="text-blue-500">
                                        {getApiUrl() +
                                            "/api/admin/courier/steadfast/callback"}
                                    </span>
                                </label>
                            </div>
                        </>
                    )}

                    <Button variant="outline" type="submit">
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const HandleSSLCOMMERZ = ({ formik }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Settings(SSLCOMMERZ)</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="sslcommerz-enabled"
                            checked={
                                formik.values.sslCommerz.isSslCommerzEnabled
                            }
                            onCheckedChange={(checked) =>
                                formik.setFieldValue(
                                    "sslCommerz.isSslCommerzEnabled",
                                    checked
                                )
                            }
                        />
                        <label htmlFor="sslcommerz-enabled">
                            Enable SSLCOMMERZ Payment
                        </label>
                    </div>
                    {formik.values.sslCommerz.isSslCommerzEnabled && (
                        <>
                            <Input
                                value={formik.values.sslCommerz.storeId}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "sslCommerz.storeId",
                                        e.target.value
                                    )
                                }
                                placeholder="Store ID"
                                required
                            />
                            <Input
                                value={formik.values.sslCommerz.storePassword}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "sslCommerz.storePassword",
                                        e.target.value
                                    )
                                }
                                placeholder="Store Password"
                                required
                            />
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is-live"
                                    checked={formik.values.sslCommerz.isLive}
                                    onCheckedChange={(checked) =>
                                        formik.setFieldValue(
                                            "sslCommerz.isLive",
                                            checked
                                        )
                                    }
                                />
                                <label htmlFor="is-live">Is Live</label>
                            </div>
                        </>
                    )}
                    <Button variant="outline" type="submit">
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const HandleFacebookPixel = ({ formik }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Facebook Pixel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Input
                    placeholder="Pixel ID"
                    value={formik.values.facebookPixel.pixelId}
                    onChange={(e) =>
                        formik.setFieldValue(
                            "facebookPixel.pixelId",
                            e.target.value
                        )
                    }
                    name="facebookPixel.pixelId"
                />
                <Input
                    placeholder="Access Token"
                    value={formik.values.facebookPixel.accessToken}
                    onChange={(e) =>
                        formik.setFieldValue(
                            "facebookPixel.accessToken",
                            e.target.value
                        )
                    }
                />
                <Input
                    placeholder="Test Event Code"
                    value={formik.values.facebookPixel.test_event_code}
                    onChange={(e) =>
                        formik.setFieldValue(
                            "facebookPixel.test_event_code",
                            e.target.value
                        )
                    }
                />
                <Button
                    variant="outline"
                    type="submit"
                    onClick={() => {
                        formik.handleSubmit();
                    }}
                >
                    Save
                </Button>
            </CardContent>
        </Card>
    );
};

const TimeZone = ({ formik }) => {
    const utcOffsets = [
        { value: "-12", label: "UTC-12 (Baker Island)" },
        { value: "-11", label: "UTC-11 (Midway Atoll)" },
        { value: "-10", label: "UTC-10 (Hawaii)" },
        { value: "-9.5", label: "UTC-9:30 (Marquesas Islands)" },
        { value: "-9", label: "UTC-9 (Alaska)" },
        { value: "-8", label: "UTC-8 (Los Angeles)" },
        { value: "-7", label: "UTC-7 (Denver)" },
        { value: "-6", label: "UTC-6 (Mexico City)" },
        { value: "-5", label: "UTC-5 (New York)" },
        { value: "-4", label: "UTC-4 (Santiago)" },
        { value: "-3.5", label: "UTC-3:30 (Newfoundland)" },
        { value: "-3", label: "UTC-3 (Buenos Aires)" },
        { value: "-2", label: "UTC-2 (South Georgia)" },
        { value: "-1", label: "UTC-1 (Azores)" },
        { value: "0", label: "UTC+0 (London)" },
        { value: "+1", label: "UTC+1 (Berlin)" },
        { value: "+2", label: "UTC+2 (Cairo)" },
        { value: "+3", label: "UTC+3 (Moscow)" },
        { value: "+3.5", label: "UTC+3:30 (Tehran)" },
        { value: "+4", label: "UTC+4 (Dubai)" },
        { value: "+4.5", label: "UTC+4:30 (Kabul)" },
        { value: "+5", label: "UTC+5 (Karachi)" },
        { value: "+5.5", label: "UTC+5:30 (Mumbai)" },
        { value: "+5.75", label: "UTC+5:45 (Kathmandu)" },
        { value: "+6", label: "UTC+6 (Dhaka)" },
        { value: "+6.5", label: "UTC+6:30 (Cocos Islands)" },
        { value: "+7", label: "UTC+7 (Bangkok)" },
        { value: "+8", label: "UTC+8 (Beijing)" },
        { value: "+8.75", label: "UTC+8:45 (Eucla)" },
        { value: "+9", label: "UTC+9 (Tokyo)" },
        { value: "+9.5", label: "UTC+9:30 (Adelaide)" },
        { value: "+10", label: "UTC+10 (Sydney)" },
        { value: "+10.5", label: "UTC+10:30 (Lord Howe Island)" },
        { value: "+11", label: "UTC+11 (Noumea)" },
        { value: "+12", label: "UTC+12 (Auckland)" },
        { value: "+12.75", label: "UTC+12:45 (Chatham Islands)" },
        { value: "+13", label: "UTC+13 (Apia)" },
        { value: "+14", label: "UTC+14 (Kiritimati)" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select UTC Offset</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                >
                    <Select
                        value={formik.values.timeZone}
                        onValueChange={(value) =>
                            formik.setFieldValue("timeZone", value)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select UTC Offset" />
                        </SelectTrigger>
                        <SelectContent>
                            {utcOffsets.map((offset) => (
                                <SelectItem
                                    key={offset.value}
                                    value={offset.value}
                                >
                                    {offset.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" type="submit">
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
