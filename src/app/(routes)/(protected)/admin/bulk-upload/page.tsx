"use client";

import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  FileUp,
  LoaderCircle,
} from "lucide-react";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        toast.error("Пожалуйста, загрузите CSV-файл");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Пожалуйста, загрузите CSV-файл");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Сначала выберите CSV-файл");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: data.message || "Товары успешно загружены",
          details: data.details,
        });

        toast.success("Массовая загрузка завершена");

        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Ошибка загрузки",
          details: data.details,
        });

        toast.error(data.error || "Ошибка загрузки");
      }
    } catch (error) {
      console.error("Upload error:", error);

      setUploadResult({
        success: false,
        message: "Во время загрузки произошла ошибка сети",
      });

      toast.error("Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {

    const csvContent = `name,sku,slug,price,compareAtPrice,brand,model,generation,description,stockQty,condition,isActive,isFeatured,categorySlug,categoryName,weight,metaTitle,metaDescription
Тормозные колодки передние,BMW-BRAKE-001,tormoznye-kolodki-bmw-x5-e70,120.00,150.00,BMW,X5,E70,Комплект передних тормозных колодок,15,new,true,true,brake-pads,Тормозные колодки,2.100,Тормозные колодки BMW X5,Качественные передние тормозные колодки BMW
Масляный фильтр двигателя,BMW-OIL-002,maslyanyy-filtr-bmw-e90,25.00,35.00,BMW,3 Series,E90,Фильтр для замены моторного масла,40,new,true,false,oil-filters,Масляные фильтры,0.300,Масляный фильтр BMW E90,Надежный масляный фильтр BMW
Передний амортизатор Mercedes,MER-AMORT-003,peredniy-amortizator-mercedes-w204,180.00,220.00,Mercedes-Benz,C-Class,W204,Передний газомасляный амортизатор,8,new,true,true,suspension-parts,Детали подвески,4.500,Амортизатор Mercedes W204,Амортизатор для комфортной езды
Ступичный подшипник Audi,AUD-BEAR-004,stupichnyy-podshipnik-audi-a4-b8,75.00,95.00,Audi,A4,B8,Подшипник передней ступицы,12,new,true,false,wheel-bearings,Подшипники ступицы,1.200,Ступичный подшипник Audi A4,Подшипник повышенной надежности
Воздушный фильтр Toyota,TOY-AIR-005,vozdushnyy-filtr-toyota-camry-xv50,22.00,30.00,Toyota,Camry,XV50,Фильтр очистки воздуха двигателя,30,new,true,false,air-filters,Воздушные фильтры,0.250,Воздушный фильтр Toyota Camry,Фильтр для эффективной очистки воздуха
Радиатор охлаждения Volkswagen,VW-RAD-006,radiator-okhlazhdeniya-vw-passat-b7,210.00,260.00,Volkswagen,Passat,B7,Основной радиатор системы охлаждения,6,new,true,true,cooling-system,Система охлаждения,7.800,Радиатор Passat B7,Радиатор системы охлаждения двигателя
Шаровая опора Ford,FORD-BALL-007,sharovaya-opora-ford-focus-mk3,45.00,60.00,Ford,Focus,Mk3,Шаровая опора передней подвески,20,new,true,false,suspension-parts,Детали подвески,0.900,Шаровая опора Ford Focus,Надежная шаровая опора
Комплект сцепления Skoda,SKO-CLUTCH-008,komplekt-stsepleniya-skoda-octavia-a7,320.00,390.00,Skoda,Octavia,A7,Комплект сцепления для механической КПП,5,new,true,true,clutch-parts,Детали сцепления,6.500,Сцепление Skoda Octavia,Полный комплект сцепления
Прокладка клапанной крышки Nissan,NIS-GASKET-009,prokladka-klapannoy-kryshki-nissan-xtrail-t32,18.00,25.00,Nissan,X-Trail,T32,Прокладка клапанной крышки двигателя,35,new,true,false,engine-gaskets,Прокладки двигателя,0.150,Прокладка Nissan X-Trail,Надежная прокладка двигателя
Задний фонарь Kia,KIA-LIGHT-010,zadniy-fonar-kia-sportage-ql,95.00,120.00,Kia,Sportage,QL,Задний светодиодный фонарь,10,new,true,true,lighting-parts,Детали освещения,2.400,Задний фонарь Kia Sportage,Оригинальный задний фонарь`;

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "product-template.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    toast.success("Шаблон скачан");
  };

  return (
    <div className="flex xl:flex-row flex-col justify-start items-start">

      <div className="w-full xl:p-14 p-4">
        <h1 className="text-4xl font-bold mb-8">
          Массовая загрузка товаров
        </h1>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-800 flex items-center gap-2">
            <Upload size={20} />
            Инструкция
          </h2>

          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Скачайте CSV-шаблон ниже</li>

            <li>
              Заполните данные товаров — обязательные поля: name, sku,
              slug, price
            </li>

            <li>
              Используйте <strong>new</strong>, <strong>used</strong> или{" "}
              <strong>refurbished</strong> для поля condition
            </li>

            <li>
              Поля isActive и isFeatured принимают{" "}
              <strong>true</strong> или <strong>false</strong>
            </li>

            <li>Максимальный размер файла: 5MB</li>
          </ul>
        </div>

        {/* Download Template */}
        <div className="mb-6">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <Download size={20} />
            Скачать CSV-шаблон
          </button>
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileUp className="text-gray-400 mx-auto mb-4" size={64} />

            <p className="text-lg mb-2">
              {file ? (
                <span className="font-semibold text-blue-600">
                  Выбран файл: {file.name} (
                  {(file.size / 1024).toFixed(2)} KB)
                </span>
              ) : (
                "Перетащите CSV-файл сюда или нажмите для выбора"
              )}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer transition-colors"
            >
              Выбрать CSV-файл
            </label>
          </div>
        </div>

        {/* Upload Button */}
        {file && (
          <div className="mb-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-colors ${uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="animate-spin" size={20} />
                  Загрузка...
                </span>
              ) : (
                "Загрузить товары"
              )}
            </button>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div
            className={`border-l-4 p-6 rounded-lg ${uploadResult.success
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
              }`}
          >
            <div className="flex items-start gap-3">
              {uploadResult.success ? (
                <CheckCircle2
                  className="text-green-500 flex-shrink-0 mt-1"
                  size={32}
                />
              ) : (
                <XCircle
                  className="text-red-500 flex-shrink-0 mt-1"
                  size={32}
                />
              )}

              <div className="flex-1">
                <h3
                  className={`text-xl font-bold mb-2 ${uploadResult.success
                    ? "text-green-800"
                    : "text-red-800"
                    }`}
                >
                  {uploadResult.success
                    ? "Загрузка успешно завершена"
                    : "Ошибка загрузки"}
                </h3>

                <p
                  className={`mb-3 ${uploadResult.success
                    ? "text-green-700"
                    : "text-red-700"
                    }`}
                >
                  {uploadResult.message}
                </p>

                {uploadResult.details && (
                  <div className="bg-white rounded p-4 space-y-2">
                    <p className="font-semibold">
                      Статистика загрузки:
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {uploadResult.details.processed}
                        </p>

                        <p className="text-sm text-gray-600">
                          Обработано
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {uploadResult.details.successful}
                        </p>

                        <p className="text-sm text-gray-600">
                          Успешно
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {uploadResult.details.failed}
                        </p>

                        <p className="text-sm text-gray-600">
                          Ошибок
                        </p>
                      </div>
                    </div>

                    {uploadResult.details.errors &&
                      uploadResult.details.errors.length > 0 && (
                        <div className="mt-4">
                          <p className="font-semibold text-red-700 mb-2">
                            Ошибки:
                          </p>

                          <ul className="list-disc list-inside space-y-1 text-sm text-red-600 max-h-40 overflow-y-auto">
                            {uploadResult.details.errors.map(
                              (error, index) => (
                                <li key={index}>{error}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CSV Format Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Формат CSV-файла
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Поле
                  </th>

                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Обязательно
                  </th>

                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Тип
                  </th>

                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Описание
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["name", "✅ Да", "String", "Название товара"],
                  ["sku", "✅ Да", "String", "Уникальный артикул товара"],
                  ["slug", "✅ Да", "String", "URL-идентификатор (например my-product)"],
                  ["price", "✅ Да", "Decimal", "Цена товара (например 9999.00)"],
                  ["compareAtPrice", "❌ Нет", "Decimal", "Старая цена для отображения скидки"],
                  ["brand", "❌ Нет", "String", "Название бренда"],
                  ["model", "❌ Нет", "String", "Название модели"],
                  ["generation", "❌ Нет", "String", "Поколение / год (например 2024)"],
                  ["description", "❌ Нет", "String", "Описание товара"],
                  ["stockQty", "❌ Нет", "Number", "Количество на складе (по умолчанию 0)"],
                  ["condition", "❌ Нет", "Enum", "new | used | refurbished (по умолчанию new)"],
                  ["isActive", "❌ Нет", "Boolean", "true | false (по умолчанию true)"],
                  ["isFeatured", "❌ Нет", "Boolean", "true | false (по умолчанию false)"],
                  ["categoryId", "❌ Нет", "UUID", "ID категории из базы данных"],
                  ["weight", "❌ Нет", "Decimal", "Вес товара в кг (например 1.500)"],
                  ["metaTitle", "❌ Нет", "String", "SEO-заголовок страницы товара"],
                  ["metaDescription", "❌ Нет", "String", "SEO-описание страницы товара"],
                ].map(([col, req, type, desc]) => (
                  <tr key={col}>
                    <td className="border border-gray-300 px-4 py-2 font-mono">
                      {col}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {req}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {type}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload History */}
        <div className="mt-8">
          <BulkUploadHistory />
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
