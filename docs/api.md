# Sink API

手动编写API文档可能非常繁琐，在[Nitro's OpenAPI](https://nitro.unjs.io/config#openapi)正式发布后，我们将自动生成文档。

此处提供了创建短链接API的示例。其他API目前可通过浏览器开发者工具查看。

## API Reference

### Create Short Link

```http
  POST /api/link/create
```

| Header          | Description        |
| :-------------- | :----------------- |
| `authorization` | `Bearer SinkCool`  |
| `content-type`  | `application/json` |

#### Example

```http
  POST /api/link/create
  HEADER authorization: Bearer SinkCool
  HEADER content-type: application/json
  BODY  {
          "url": "https://github.com/ccbikai/Sink/issues/14",
          "slug": "issue14"
        }
```

请求体数据必须是JSON格式。

```http
  RESPONSE 201
  BODY  {
          "link": {
            "id": "xpqhaurv5q",
            "url": "https://github.com/ccbikai/Sink/issues/14",
            "slug": "issue14",
            "createdAt": 1718119809,
            "updatedAt": 1718119809
          }
        }
```

| Parameter   | Type        | Description                                                                                |
| :---------- | :---------- | :----------------------------------------------------------------------------------------- |
| `id`        | `string`    | 这是由Sink自动生成的                                                                       |
| `url`       | `string`    | 这是对提交URL的确认，为必填项。                                                            |
| `slug`      | `string`    | 这是系统生成的短标识，可自动生成或由输入提供（若有）                                       |
| `createdAt` | `timestamp` | 这是由UNIX时间戳自动生成的。                                                               |
| `updatedAt` | `timestamp` | 这是由UNIX时间戳自动生成的。                                                               |
