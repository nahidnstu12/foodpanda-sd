'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CheckoutPageProps {
  cartData: any;
  addresses: any[];
}

export function CheckoutPage({ cartData, addresses }: CheckoutPageProps) {
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr) => addr.is_default)?.id || addresses[0]?.id
  );
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'SSL'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderData = {
      items: cartData.items.map((item: any) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        selected_choices: item.selected_choices,
        calculated_price: item.calculated_price,
        special_instructions: item.special_instructions,
      })),
      delivery_address_id: selectedAddress,
      payment_method: paymentMethod,
      restaurant_id: cartData.restaurant.id,
      subtotal: cartData.subtotal,
      delivery_fee: cartData.delivery_fee,
      total: cartData.total,
    };

    console.log('Placing order:', orderData);

    // Simulate API call
    setTimeout(() => {
      if (paymentMethod === 'SSL') {
        // Redirect to SSL payment page
        console.log('Redirecting to SSL payment...');
      } else {
        // Redirect to order confirmation
        console.log('Order placed with COD');
      }
      setIsProcessing(false);
    }, 2000);
  };

  const selectedAddressData = addresses.find(
    (addr) => addr.id === selectedAddress
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link href="/resturant/2/2">
            <Button variant="ghost" className="hover:bg-[#06C167]/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Delivery & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="border-[#06C167]/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#06C167]" />
                    Delivery Address
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#06C167]/20 hover:bg-[#06C167]/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAddress}
                  onValueChange={setSelectedAddress}
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <RadioGroupItem value={address.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="font-semibold text-[#1C1C1C]">
                            {address.label}
                          </Label>
                          {address.is_default && (
                            <Badge
                              variant="secondary"
                              className="bg-[#06C167]/10 text-[#06C167]"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{address.street}</p>
                        <p className="text-gray-600 mb-1">
                          {address.area}, {address.city} - {address.postal_code}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {address.phone}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {!address.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-[#06C167]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#06C167]" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as 'COD' | 'SSL')
                  }
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="COD" />
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-[#06C167]" />
                        <div>
                          <Label className="font-semibold">
                            Cash on Delivery
                          </Label>
                          <p className="text-sm text-gray-600">
                            Pay when your order arrives
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="SSL" />
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-[#06C167]" />
                        <div>
                          <Label className="font-semibold">SSL Commerce</Label>
                          <p className="text-sm text-gray-600">
                            Pay securely with card/bKash/Nagad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Order Summary */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <Card className="border-[#06C167]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#06C167]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#06C167] font-bold text-lg">🍕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C1C1C]">
                      {cartData.restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>25-35 min</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="text-sm text-gray-600">
                  <p>Delivery Fee: ৳{cartData.restaurant.delivery_fee}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-[#06C167]/10">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartData.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.menu_item.image_url}
                          alt={item.menu_item.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-1 -right-1 bg-[#06C167] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#1C1C1C]">
                          {item.menu_item.name}
                        </h4>
                        {item.selected_choices.map(
                          (choice: any, index: number) => (
                            <p key={index} className="text-sm text-gray-600">
                              {choice.customization_name}:{' '}
                              {choice.choice_names.join(', ')}
                            </p>
                          )
                        )}
                        {item.special_instructions && (
                          <p className="text-sm text-gray-500 italic">
                            Note: {item.special_instructions}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-[#06C167]">
                          ৳{item.calculated_price} × {item.quantity} = ৳
                          {item.calculated_price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card className="border-[#06C167]/10">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{cartData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>৳{cartData.delivery_fee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-[#1C1C1C]">
                    <span>Total</span>
                    <span>৳{cartData.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-[#06C167] hover:bg-[#05a855] text-white py-4 text-lg font-semibold"
            >
              {isProcessing
                ? 'Processing...'
                : `Place Order - ৳${cartData.total}`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
