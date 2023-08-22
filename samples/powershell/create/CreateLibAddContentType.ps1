
function CreateLibraryWithCT {
    param ([string] $LibraryName)

    $ctName = "My Custom CT"
    $libExist = Get-PnPList $LibraryName -ErrorAction SilentlyContinue
    if ($libExist) {
        Write-Host "Library - $LibraryName already exists" -ForegroundColor Yellow
    }
    else {
        #Creating library with Document library template
        New-PnPList -Title $LibraryName -Template DocumentLibrary
        Write-Host "Created Library " $LibraryName -ForegroundColor Green
    }

    $ctExist = Get-PnPContentType $ctName -ErrorAction SilentlyContinue
    if ($ctExist) {
        Write-Host "Content type - $ctName already exists" -ForegroundColor Yellow
    }
    else {
        $ctExist = Add-PnPContentType -Name $ctName `
            -Group "Custom Content Types" `
            -Description "My custom ct"
        Write-Host "Created Content Type " $ctName -ForegroundColor Green
    }

    #region Adding, setting default content type and remove existing CT
    Add-PnPContentTypeToList -List $LibraryName -ContentType $ctExist
    Set-PnPDefaultContentTypeToList -List $LibraryName -ContentType $ctName
    Remove-PnPContentTypeFromList -List $LibraryName -ContentType "Document"
    #endregion
}

try {
    $clientId = ""
    $clientSecret = ""
    $siteUrl = ""
    Connect-PnPOnline -Url $siteUrl -ClientId $clientId -ClientSecret $clientSecret

    CreateLibraryWithCT -LibraryName "My Lib"
}
catch {
    Write-Error "Something wrong: " $_
}
finally {
    $pnpConnection = Get-PnPConnection -ErrorAction SilentlyContinue
    if ($pnpConnection) {
        Disconnect-PnPOnline
    }
}



